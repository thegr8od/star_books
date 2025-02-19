package com.starbooks.backend.emotion.model;

public class EmotionPoint {
    private double xvalue;  // Valence
    private double yvalue;  // Arousal

    public EmotionPoint(double xvalue, double yvalue) {
        this.xvalue = xvalue;
        this.yvalue = yvalue;
    }

    public double getxvalue() {
        return xvalue;
    }

    public void setxvalue(double xvalue) {
        this.xvalue = xvalue;
    }

    public double getyvalue() {
        return yvalue;
    }

    public void setyvalue(double yvalue) {
        this.yvalue = yvalue;
    }

    @Override
    public String toString() {
        return String.format("EmotionPoint(Valence=%.2f, Arousal=%.2f)", xvalue, yvalue);
    }
}
