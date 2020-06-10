package a2016csb1057.iitrpr.ac.in.sam_testing;

import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import model.ResObj;
import model.TokenObj;
import remote.ApiUtils;
import remote.UserService;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import static a2016csb1057.iitrpr.ac.in.sam_testing.R.id.btnLogin;
import static a2016csb1057.iitrpr.ac.in.sam_testing.R.id.edtPassword;
import static a2016csb1057.iitrpr.ac.in.sam_testing.R.id.edtUsername;
import static android.R.attr.password;

public class MainActivity extends AppCompatActivity {

    TextView txtUsername;
    SharedPreferences sp;
    UserService userService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        userService = ApiUtils.getUserService();
        sp = getSharedPreferences("login",MODE_PRIVATE);
        //sp.edit().putBoolean("logged",false).apply();
        //sp.edit().putString("authToken","").apply();
        String token = sp.getString("authToken","");
        if(token.length()==0){
            goToLoginActivity();
        }
        else {
            txtUsername = (TextView) findViewById(R.id.txtUsername);
            String loginAs = sp.getString("loginAs", "");
            if (loginAs.equals("Student")){
                goToStudentMainActivity();
            }
            else if (loginAs.equals("Instructor")){
                goToInstructorMainActivity();
            }
            else if (loginAs.equals("TA")){
                goToTAMainActivity();
            }
            else{
                goToLoginActivity();
            }

            //sample run of how to call apis
            /*Call call = userService.posts("Bearer "+token);
            call.enqueue(new Callback() {
                @Override
                public void onResponse(Call call, Response response) {
                    if(response.isSuccessful()){
                        ResObj ResObj = (ResObj) response.body();
                        if(ResObj.getMessage()!=null){
                            txtUsername.setText(ResObj.getMessage());
                        } else {
                            Toast.makeText(MainActivity.this, "Could not receive the message", Toast.LENGTH_SHORT).show();
                        }
                    } else {
                        Toast.makeText(MainActivity.this, "Error! Please try again!", Toast.LENGTH_SHORT).show();
                    }
                }

                @Override
                public void onFailure(Call call, Throwable t) {
                    Toast.makeText(MainActivity.this, t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            });
            */

            /*Bundle extras = getIntent().getExtras();
            String username;

            if (extras != null) {
                username = extras.getString("username");
                txtUsername.setText("Welcome " + username);
            }*/

        }

    }

    public void goToLoginActivity(){
        Intent i = new Intent(MainActivity.this,LoginActivity.class);
        startActivity(i);
    }

    public void goToStudentMainActivity(){
        Intent i = new Intent(MainActivity.this,StudentMainActivity.class);
        startActivity(i);
    }

    public void goToInstructorMainActivity(){
        Intent i = new Intent(MainActivity.this,InstructorMainActivity.class);
        startActivity(i);
    }

    public void goToTAMainActivity(){
        Intent i = new Intent(MainActivity.this,TAMainActivity.class);
        startActivity(i);
    }
}