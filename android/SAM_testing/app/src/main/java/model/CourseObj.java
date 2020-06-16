package model;

import static android.R.attr.name;

/**
 * Created by SAHIL on 15-06-2020.
 */

public class CourseObj {
    private String courseId;
    private String classInfoId;

    public String getCourseId() { return courseId; }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public String getClassInfoId() {
        return classInfoId;
    }

    public void setClassInfoId(String classInfoId) { this.classInfoId = classInfoId; }
}
