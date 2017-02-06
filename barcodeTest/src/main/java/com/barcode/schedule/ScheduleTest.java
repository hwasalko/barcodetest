package com.barcode.schedule;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ScheduleTest {

//	@Scheduled(cron = "0 30 01 * * *") // 초 분 시 일 월 요일
	@Scheduled(fixedDelay = 3000) //3초 주기
    public void test(){
        System.out.println("스캐줄링 test");
    }
	
}
