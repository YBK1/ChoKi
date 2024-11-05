package com.yeojiphap.choki.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.MongoTransactionManager;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
// @EnableMongoRepositories(basePackages = "com.yeojiphap.choki.domain")
public class MongoDBConfig {
	// @Bean
	// MongoTransactionManager transactionManager(MongoDatabaseFactory dbFactory) {
	// 	return new MongoTransactionManager(dbFactory);
	// }
}