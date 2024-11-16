package com.yeojiphap.choki.domain.map.service;

public class SafeWeightCalculator implements WeightCalculator {

    @Override
    public double calculate(double length, boolean hasCctv, boolean hasCrossing) {
        double weight = length;
        if (hasCctv) weight *= 0.5;     // CCTV가 있으면 가중치를 낮춤
        if (hasCrossing) weight *= 2.0; // 횡단보도가 있으면 가중치를 높임
        return weight;
    }
}
