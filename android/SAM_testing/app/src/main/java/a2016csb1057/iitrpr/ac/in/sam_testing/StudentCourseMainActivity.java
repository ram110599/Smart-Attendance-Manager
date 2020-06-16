package a2016csb1057.iitrpr.ac.in.sam_testing;

import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.TextView;
import android.widget.Toast;

import model.StudentCourseDetailsObj;
import remote.ApiUtils;
import remote.UserService;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class StudentCourseMainActivity extends AppCompatActivity {

    TextView txtCourseId;
    TextView txtClassId;
    TextView txtAtten;
    TextView txtTotClasses;
    UserService userService;
    SharedPreferences sp;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_student_course_main);

        userService = ApiUtils.getUserService();
        txtCourseId = (TextView) findViewById(R.id.txtCourseId);
        txtClassId = (TextView) findViewById(R.id.txtClassId);
        txtAtten = (TextView) findViewById(R.id.txtAtten);
        txtTotClasses = (TextView) findViewById(R.id.txtTotClasses);
        sp = getSharedPreferences("login",MODE_PRIVATE);
        String token = sp.getString("authToken","");
        Bundle extras = getIntent().getExtras();
        String courseId = "";
        String classInfoId = "";
        if (extras != null) {
            courseId = extras.getString("courseId");
            classInfoId = extras.getString("classInfoId");
            txtCourseId.setText("Course: " + courseId);
            txtClassId.setText("Class: " + classInfoId);
            Call<StudentCourseDetailsObj> call = userService.studentCourseDetails("Bearer "+token, classInfoId);
            call.enqueue(new Callback<StudentCourseDetailsObj>() {
                @Override
                public void onResponse(Call<StudentCourseDetailsObj> call, Response<StudentCourseDetailsObj> response) {
                    if(response.isSuccessful()){
                        final StudentCourseDetailsObj StudentCourseDetailsObj1 = response.body();
                        txtAtten.setText("Attendance: "+StudentCourseDetailsObj1.getAttendance());
                        txtTotClasses.setText("Total classes: "+StudentCourseDetailsObj1.getTotClasses());
                    } else {
                        Toast.makeText(StudentCourseMainActivity.this, "Error occurred!", Toast.LENGTH_SHORT).show();
                    }
                }

                @Override
                public void onFailure(Call call, Throwable t) {
                    Toast.makeText(StudentCourseMainActivity.this, t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            });
        }


    }
}
