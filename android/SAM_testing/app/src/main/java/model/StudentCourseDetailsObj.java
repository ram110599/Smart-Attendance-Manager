package model;

/**
 * Created by SAHIL on 17-06-2020.
 */

public class StudentCourseDetailsObj {
    private String courseId;
    private String classInfoId;
    private int attendance;
    private int totClasses;

    public String getCourseId() { return courseId; }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public String getClassInfoId() {
        return classInfoId;
    }

    public void setClassInfoId(String classInfoId) { this.classInfoId = classInfoId; }

    public int getAttendance() { return attendance; }

    public void setAttendance(int attendance) { this.attendance = attendance; }

    public int getTotClasses() { return totClasses; }

    public void setTotClasses(int totClasses) { this.totClasses = totClasses; }
}
