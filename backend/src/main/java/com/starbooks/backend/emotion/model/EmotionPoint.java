package com.starbooks.backend.emotion.model;

public class EmotionPoint {
    private double valence;
    private double arousal;

    public EmotionPoint(double valence, double arousal) {
        this.valence = valence;
        this.arousal = arousal;
    }

    public double getValence() {
        return valence;
    }

    public double getArousal() {
        return arousal;
    }
}
