package com.yeojiphap.choki.domain.map.service;

public interface WeightCalculator {
    double calculate(double length, boolean hasCctv, boolean hasCrossing);
}
