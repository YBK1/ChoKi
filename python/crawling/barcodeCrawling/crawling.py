from datetime import datetime
import requests
from bs4 import BeautifulSoup
import time
from elasticsearch import Elasticsearch
import logging

# 로깅 설정
# logging.basicConfig(
#     filename='crawler.log',
#     level=logging.INFO,
#     format='%(asctime)s [%(levelname)s] - %(message)s'
# )


class WebCrawler:
    def __init__(self):
        print("저장")
        # 엘라스틱서치 연결
        # self.es = Elasticsearch(['http://localhost:9200'])

        # 인덱스가 없으면 생성
        # if not self.es.indices.exists(index="crawled_data"):
        #     self.es.indices.create(
        #         index="crawled_data",
        #         body={
        #             "mappings": {
        #                 "properties": {
        #                     "title": {"type": "text"},
        #                     "content": {"type": "text"},
        #                     "url": {"type": "keyword"},
        #                     "crawled_at": {"type": "date"}
        #                 }
        #             }
        #         }
        #     )
        # logging.info("Elasticsearch connected")

    def post_request(self, url: str, data: Dict[str, Any], custom_headers: Dict[str, str] = None) -> Dict:
        """
        POST 요청을 보내고 결과를 반환하는 메서드

        Args:
            url (str): 요청을 보낼 URL
            data (dict): POST 요청에 포함될 데이터
            custom_headers (dict): 추가적인 헤더 (선택사항)

        Returns:
            dict: 응답 데이터
        """
        try:
            # 기본 헤더에 커스텀 헤더 추가
            if custom_headers:
                self.headers.update(custom_headers)

            # POST 요청 보내기
            response = self.session.post(
                url,
                data=json.dumps(data),
                headers=self.headers,
                timeout=30
            )
            response.raise_for_status()

            # JSON 응답 파싱
            try:
                return response.json()
            except json.JSONDecodeError:
                # JSON이 아닌 경우 BeautifulSoup으로 파싱
                return self.parse_html(response.text)

        except requests.exceptions.RequestException as e:
            print(f"요청 중 오류 발생: {e}")
            return {}

    def parse_data(self, soup, url):
        try:
            # 여기에 실제 크롤링 로직 작성
            # 예시 코드:
            data = {
                "title": soup.title.text if soup.title else "",
                "content": soup.get_text()[:1000],  # 처음 1000자만 저장
                "url": url,
                "crawled_at": datetime.now()
            }
            return data
        except Exception as e:
            logging.error(f"Error parsing data: {str(e)}")
            return None

    # def save_to_es(self, data):
    #     try:
    #         self.es.index(
    #             index="crawled_data",
    #             document=data
    #         )
    #         logging.info(f"Saved data from URL: {data['url']}")
    #     except Exception as e:
    #         logging.error(f"Error saving to Elasticsearch: {str(e)}")

    def run(self):
        # 크롤링할 URL 리스트
        urls = [
            "https://www.koreannet.or.kr/front/allproduct/prodSrchList.do",
        ]

        post_data = {
            "searchGtin": "",
            "pageNum": 1,
            "searchText": "연필"
        }

        for url in urls:
            logging.info(f"Starting crawl of {url}")
            soup = crawler.post_request(url, post_data)
            if soup:
                data = self.parse_data(soup, url)
                if data:
                    self.save_to_es(data)
                time.sleep(2)  # 요청 간격 조절


if __name__ == "__main__":
    try:
        crawler = WebCrawler()
        crawler.run()
    except KeyboardInterrupt:
        logging.info("Crawler stopped by user")
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")