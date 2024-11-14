package com.yeojiphap.choki.domain.mission.service;

import java.io.IOException;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.yeojiphap.choki.domain.mission.domain.Mission;
import com.yeojiphap.choki.domain.mission.domain.MissionType;
import com.yeojiphap.choki.domain.mission.domain.Status;
import com.yeojiphap.choki.domain.mission.dto.MissionCommentRequestDto;
import com.yeojiphap.choki.domain.mission.dto.MissionDetailResponseDto;
import com.yeojiphap.choki.domain.mission.dto.MissionImageRequestDto;
import com.yeojiphap.choki.domain.mission.dto.MissionResponseDto;
import com.yeojiphap.choki.domain.mission.exception.MissionNotFoundException;
import com.yeojiphap.choki.domain.mission.repository.MissionRepository;
import com.yeojiphap.choki.domain.notification.service.NotificationService;
import com.yeojiphap.choki.domain.shopping.dto.ShoppingCreateRequestDto;
import com.yeojiphap.choki.global.s3.S3Service;
import com.yeojiphap.choki.global.s3.S3UploadFailedException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MissionService {
	private final MissionRepository missionRepository;
	private final S3Service s3Service;
	private final NotificationService notificationService;

	// 미션 조회하기
	public MissionDetailResponseDto getMission(String id) {
		Mission mission = missionRepository.findById(new ObjectId(id)).orElseThrow(MissionNotFoundException::new);

		return new MissionDetailResponseDto(mission);
	}

	// 장보기 미션 저장하기
	// 경험치는 일단 하드코딩 했음!!
	public ObjectId addShoppingMission(ShoppingCreateRequestDto shoppingCreateRequestDto){
		Mission mission = Mission.builder()
			.parentId(shoppingCreateRequestDto.getParentId())
			.childId(shoppingCreateRequestDto.getChildId())
			.content("동네 마트 장보기")
			.exp(50)
			.status(Status.IN_PROGRESS)
			.completedAt(null)
			.image(null)
			.missionType(MissionType.SHOP)
			.shoppingId(null)
			.comment(null)
			.build();

		Mission savedMission = missionRepository.saveMission(mission);
		return savedMission.getId();
	}

	// 장보기 미션에 장보기 할당하기
	public void allocateShoppingMission(ObjectId missionId, ObjectId shoppingId){
		missionRepository.updateShoppingId(missionId, shoppingId);
	}

	// 미션 저장하기
	public void addMission(Mission mission) {
		missionRepository.save(mission);
	}

	// 미션 삭제하기
	public void deleteMission(ObjectId id) {
		missionRepository.deleteMission(id);
	}

	// 아이 기준 미션 목록 조회하기
	public List<MissionResponseDto> getMissions(Long childId, Status status){
		List<Mission> missions = missionRepository.findAllByChildIdAndStatus(childId, status);

		// DTO로 변환
		List<MissionResponseDto> missionResponseDtos = missions.stream()
			.map((mission) -> MissionResponseDto.builder()
				.missionId(mission.getId().toString())
				.content(mission.getContent())
				.completedAt(mission.getCompletedAt())
				.image(mission.getImage())
				.type(mission.getMissionType())
				.shoppingId(mission.getShoppingId().toString())
				.build())
			.toList();

		return missionResponseDtos;
	}

	// 미션 Pending으로 상태 변환 하기
	public void setMissionStatusPending(ObjectId missionId, String image){
		missionRepository.setMissionStatusPending(missionId, image).orElseThrow(MissionNotFoundException::new);
	}

	public void addMissionComment(MissionCommentRequestDto missionCommentRequestDto){
		ObjectId missionId = new ObjectId(missionCommentRequestDto.getMissionId());
		String comment = missionCommentRequestDto.getComment();
		missionRepository.setMissionComment(missionId, comment).orElseThrow(MissionNotFoundException::new);
	}

	@Transactional
	public void addMissionImage(MissionImageRequestDto missionImageRequestDto, MultipartFile image){
		ObjectId missionId = new ObjectId(missionImageRequestDto.getMissionId());
		Mission mission = missionRepository.findById(missionId).orElseThrow(MissionNotFoundException::new);
		String imagePath = "";
		try{
			imagePath =  s3Service.uploadFile(image);
		}
		catch(IOException e){
			throw new S3UploadFailedException();
		}
		missionRepository.setMissionStatusPending(missionId, imagePath).orElseThrow(MissionNotFoundException::new);

		notificationService.addNotificationFromMission(mission);
	}
}
