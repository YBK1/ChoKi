from datetime import datetime
import requests
from bs4 import BeautifulSoup
import time
from elasticsearch import Elasticsearch
import logging
from typing import Dict, Any
from urllib.parse import urlencode

# 로깅 설정
# logging.basicConfig(
#     filename='crawler.log',
#     level=logging.INFO,
#     format='%(asctime)s [%(levelname)s] - %(message)s'
# )

class HTMLParser:
    def __init__(self, html_content):
        self.soup = BeautifulSoup(html_content, 'html.parser')

    def find_by_id(self, element_id):
        """ID로 요소 찾기"""
        return self.soup.find(id=element_id)

    def find_by_class(self, class_name):
        """클래스로 요소 찾기"""
        return self.soup.find_all(class_=class_name)

    def find_by_tag(self, tag_name):
        """태그 이름으로 요소 찾기"""
        return self.soup.find_all(tag_name)

    def find_by_css_selector(self, selector):
        """CSS 선택자로 요소 찾기"""
        return self.soup.select(selector)

    def find_by_attribute(self, attr_name, attr_value):
        """특정 속성으로 요소 찾기"""
        return self.soup.find_all(attrs={attr_name: attr_value})

    def get_text_content(self, element):
        """요소의 텍스트 내용 가져오기"""
        if element:
            return element.get_text(strip=True)
        return None

    def get_attribute_value(self, element, attr_name):
        """요소의 특정 속성 값 가져오기"""
        if element:
            return element.get(attr_name)
        return None

class WebCrawler:
    def __init__(self):
        self.session = requests.Session()
        self.headers = {
            # 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': '*/*'
        }
        # 엘라스틱서치 연결
        self.es = Elasticsearch(
            "https://localhost:9200",
            ca_certs="../../../../../sources/elasticsearch-8.15.3/config/certs/http_ca.crt",
            basic_auth=("editor", "editor")
        )

        try:
            if self.es.ping():
                print("Successfully connected to Elasticsearch")
                # 클러스터 정보 출력
                print(self.es.info())
                # 인덱스 목록 출력
                print(self.es.cat.indices())
            else:
                print("Could not connect to Elasticsearch")
        except Exception as e:
            print(f"Connection failed with error: {str(e)}")

        # 인덱스가 없으면 생성
        if not self.es.indices.exists(index="product"):
            self.es.indices.create(
                index="product",
                body={
                    "mappings": {
                        "properties": {
                            "image": {"type": "text"},
                            "code": {"type": "long"},
                            "type": {"type": "text"},
                            "name": {"type": "text"}
                        }
                    }
                }
            )
        logging.info("Elasticsearch connected")

    def post_request(self, url: str, form_data: Dict[str, Any], custom_headers: Dict[str, str] = None) -> list:
        """
        x-www-form-urlencoded 형식으로 POST 요청을 보내는 메서드

        Args:
            url (str): 요청을 보낼 URL
            form_data (dict): POST 요청에 포함될 폼 데이터
            custom_headers (dict): 추가적인 헤더 (선택사항)

        Returns:
            dict: 응답 데이터
        """
        try:
            # 기본 헤더에 커스텀 헤더 추가
            request_headers = self.headers.copy()
            if custom_headers:
                request_headers.update(custom_headers)

            # POST 요청 보내기 (form-urlencoded 형식)
            response = self.session.post(
                url,
                data=form_data,  # requests가 자동으로 form-urlencoded 형식으로 인코딩
                headers=request_headers,
                timeout=30
            )

            # 응답 상태 확인
            response.raise_for_status()
            # print(response.text)

            # 응답 형식에 따라 처리
            content_type = response.headers.get('content-type', '').lower()
            if 'application/json' in content_type:
                return response.json()
            else:
                return self.parse_products(response.text)

        except requests.exceptions.RequestException as e:
            print(f"요청 중 오류 발생: {e}")
            return {}

    def parse_products(self, html_content):
        """
        제품 정보를 추출하는 함수

        Returns:
            list: 각 제품의 정보를 담은 딕셔너리 리스트
        """
        soup = BeautifulSoup(html_content, 'html.parser')
        products = []

        # 모든 제품 리스트 아이템 찾기
        product_items = soup.find_all('li')

        for item in product_items:
            # 각 제품의 정보를 담을 딕셔너리
            product_info = {}

            # 1. 이미지 URL 추출
            img_tag = item.select_one('.img img')
            if img_tag:
                product_info['image'] = "https://www.koreannet.or.kr" + img_tag.get('src')

            # 2. 제품 번호 추출
            num_div = item.select_one('.num')
            if num_div:
                product_info['number'] = num_div.text.strip()

            # 3. 제품 이름 추출
            name_div = item.select_one('.nm')
            if name_div:
                product_info['name'] = name_div.text.strip()

            # 4. 카테고리 추출
            category_div = item.select_one('.cate')
            if category_div:
                product_info['category'] = category_div.text.strip()

            # 유효한 제품 정보가 있는 경우에만 리스트에 추가
            if product_info:
                products.append(product_info)

        return products

    def save_product(self, product_data, index_name='product'):
        """
        제품 정보를 엘라스틱서치에 저장
        """
        try:
            # 문서 ID로 제품 번호 사용
            doc_id = product_data.get('number')

            # 타임스탬프 추가
            product_data['timestamp'] = datetime.now().isoformat()

            # 엘라스틱서치에 저장
            response = self.es.index(
                index=index_name,
                id=doc_id,
                document=product_data
            )

            return response['result']

        except Exception as e:
            print(f"저장 중 오류 발생: {e}")
            return None

    def run(self):
        # 크롤링할 URL 리스트
        url = "https://www.koreannet.or.kr/front/allproduct/prodSrchList.do"

        post_data = {
            "searchGtin": "",
            "pageNum": 1,
            "searchText": "우유"
        }

        for i in range(157):
            post_data['pageNum'] = i
            logging.info(f"Starting crawl of {url}")
            soup = crawler.post_request(url, post_data)
            if soup:
                print(soup)
                for product in soup:
                    self.save_product(product)
                time.sleep(2)  # 요청 간격 조절


if __name__ == "__main__":
    try:
        crawler = WebCrawler()
        crawler.run()
    except KeyboardInterrupt:
        logging.info("Crawler stopped by user")
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")