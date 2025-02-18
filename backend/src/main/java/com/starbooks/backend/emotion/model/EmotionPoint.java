package com.starbooks.backend.emotion.model;

public class EmotionPoint {
    private double xvalue;
    private double yvalue;

    public EmotionPoint(double xvalue, double yvalue) {
        this.xvalue = xvalue;
        this.yvalue = yvalue;
    }

    public double getxvalue() {
        return xvalue;
    }

    public double getyvalue() {
        return yvalue;
    }
}
