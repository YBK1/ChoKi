package com.yeojiphap.choki.global.config;

import java.security.KeyStore;
import java.security.cert.Certificate;
import java.security.cert.CertificateFactory;

import javax.net.ssl.SSLContext;

import org.apache.http.conn.ssl.TrustAllStrategy;
import org.apache.http.ssl.SSLContextBuilder;
import org.apache.http.ssl.SSLContexts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration;

@Configuration
public class ElasticsearchConfig extends ElasticsearchConfiguration {
	@Value("${spring.data.elasticsearch.username}")
	private String username;

	@Value("${spring.data.elasticsearch.password}")
	private String password;

	@Value("${spring.data.elasticsearch.uris}")
	private String[] esHost;

	@Override
	public ClientConfiguration clientConfiguration() {
		try {
			// PEM 파일을 직접 읽어서 처리
			Resource resource = new ClassPathResource("certs/http_ca.crt");
			CertificateFactory factory = CertificateFactory.getInstance("X.509");
			Certificate certificate = factory.generateCertificate(resource.getInputStream());

			KeyStore trustStore = KeyStore.getInstance(KeyStore.getDefaultType());
			trustStore.load(null, null);
			trustStore.setCertificateEntry("ca", certificate);

			SSLContext sslContext = SSLContexts.custom()
				.loadTrustMaterial(trustStore, null)
				.build();

			return ClientConfiguration.builder()
				.connectedTo(esHost)
				.usingSsl(sslContext)
				.withBasicAuth(username, password)
				.build();
		} catch (Exception e) {
			throw new RuntimeException("SSL 컨텍스트 생성 실패", e);
		}

		// return ClientConfiguration.builder()
		// 	.connectedTo(esHost)
		// 	.withBasicAuth(username, password)
		// 	.build();
	}
}