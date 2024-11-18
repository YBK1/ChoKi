package com.yeojiphap.choki.domain.map.service;

public class ShortestWeightCalculator implements WeightCalculator {
    @Override
    public double calculate(double length, boolean hasCctv, boolean hasCrossing) {
        double weight = length;
        if (hasCctv) weight *= 1;
        if (hasCrossing) weight *= 2.0;
        return weight;
    }
}
