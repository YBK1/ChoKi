package com.yeojiphap.choki.domain.chore.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yeojiphap.choki.domain.chore.domain.Chore;
import com.yeojiphap.choki.domain.chore.service.ChoreService;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/chore")
public class ChoreController {
	private final ChoreService choreService;

	@PostMapping("/create")
	public ResponseEntity<?> create() {
		return new ResponseEntity<>("message", HttpStatus.OK);
	}
}
