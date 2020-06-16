package a2016csb1057.iitrpr.ac.in.sam_testing;

import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ListView;
import android.widget.Toast;

import java.util.List;

import model.CourseObj;
import remote.ApiUtils;
import remote.UserService;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class InstructorMainActivity extends AppCompatActivity {

    Button btnLogout;
    SharedPreferences sp;
    UserService userService;
    ListView LviewCourses;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_instructor_main);

        btnLogout = (Button) findViewById(R.id.btnLogout);
        sp = getSharedPreferences("login",MODE_PRIVATE);
        String token = sp.getString("authToken","");
        userService = ApiUtils.getUserService();
        LviewCourses = (ListView) findViewById(R.id.LviewCourses);

        Call<List<CourseObj>> call = userService.Courses("Bearer "+token);
        call.enqueue(new Callback<List<CourseObj>>() {
            @Override
            public void onResponse(Call<List<CourseObj>> call, Response<List<CourseObj>> response) {
                if(response.isSuccessful()){
                    final List<CourseObj> courseObj1 = response.body();
                    String [] arr1 = new String[courseObj1.size()];
                    for (int i = 0; i< courseObj1.size(); i++){
                        arr1[i] = courseObj1.get(i).getCourseId();
                    }
                    ArrayAdapter<String> adapter = new ArrayAdapter<>(InstructorMainActivity.this,
                            android.R.layout.simple_list_item_1, android.R.id.text1, arr1);
                    LviewCourses.setAdapter(adapter);

                    LviewCourses.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                        @Override
                        public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                            Intent i = new Intent(InstructorMainActivity.this, InstructorCourseMainActivity.class);
                            i.putExtra("courseId", courseObj1.get(position).getCourseId());
                            i.putExtra("classInfoId", courseObj1.get(position).getClassInfoId());
                            startActivity(i);
                        }
                    });
                } else {
                    Toast.makeText(InstructorMainActivity.this, "No courses found!", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call call, Throwable t) {
                Toast.makeText(InstructorMainActivity.this, t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });

        btnLogout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sp.edit().putString("authToken","").apply();
                sp.edit().putString("loginAs","").apply();
                goToLoginActivity();
            }
        });

    }

    public void goToLoginActivity(){
        Intent i = new Intent(InstructorMainActivity.this,LoginActivity.class);
        startActivity(i);
        finish();
    }

}
