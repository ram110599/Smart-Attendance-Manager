package a2016csb1057.iitrpr.ac.in.sam_testing;

import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class StudentMainActivity extends AppCompatActivity {

    Button btnLogout;
    SharedPreferences sp;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_student_main);

        btnLogout = (Button) findViewById(R.id.btnLogout);
        sp = getSharedPreferences("login",MODE_PRIVATE);

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
        Intent i = new Intent(StudentMainActivity.this,LoginActivity.class);
        startActivity(i);
    }
}
