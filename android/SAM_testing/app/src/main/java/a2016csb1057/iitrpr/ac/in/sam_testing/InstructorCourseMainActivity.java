package a2016csb1057.iitrpr.ac.in.sam_testing;

import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import remote.ApiUtils;
import remote.UserService;

public class InstructorCourseMainActivity extends AppCompatActivity {

    TextView txtCourseId;
    TextView txtClassId;
    UserService userService;
    SharedPreferences sp;
    Button btnTakeAttendance;
    Button btnCheckAttendance;
    Button btnEnrolledStudents;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_instructor_course_main);

        userService = ApiUtils.getUserService();
        txtCourseId = (TextView) findViewById(R.id.txtCourseId);
        txtClassId = (TextView) findViewById(R.id.txtClassId);
        btnCheckAttendance = (Button) findViewById(R.id.btnCheckAttendance);
        btnTakeAttendance = (Button) findViewById(R.id.btnTakeAttendance);
        btnEnrolledStudents = (Button) findViewById(R.id.btnEnrolledStudents);
        sp = getSharedPreferences("login",MODE_PRIVATE);
        String token = sp.getString("authToken","");
        final Bundle extras = getIntent().getExtras();

        if (extras != null) {
            final String courseId;
            final String classInfoId;
            courseId = extras.getString("courseId");
            classInfoId = extras.getString("classInfoId");
            txtCourseId.setText("Course: " + courseId);
            txtClassId.setText("Class: " + classInfoId);

            btnTakeAttendance.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent i = new Intent(InstructorCourseMainActivity.this, InstructorTakeAttendActivity.class);
                    i.putExtra("course", courseId);
                    i.putExtra("class", classInfoId);
                    startActivity(i);
                }
            });

            btnCheckAttendance.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {

                }
            });

            btnEnrolledStudents.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {

                }
            });
        }
    }
}
