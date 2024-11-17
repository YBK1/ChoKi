package com.yeojiphap.choki.domain.map.service;

public class ShortestWeightCalculator implements WeightCalculator {
    @Override
    public double calculate(double length, boolean hasCctv, boolean hasCrossing) {
        return length;
    }
}
