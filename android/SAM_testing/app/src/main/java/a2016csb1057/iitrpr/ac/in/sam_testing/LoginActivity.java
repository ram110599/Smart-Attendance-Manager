package a2016csb1057.iitrpr.ac.in.sam_testing;

import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Toast;

import model.ResObj;
import model.TokenObj;
import remote.ApiUtils;
import remote.UserService;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity {

    EditText edtUsername;
    EditText edtPassword;
    Button btnLogin;
    UserService userService;
    SharedPreferences sp;
    RadioGroup RadGrpLoginAs;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        edtUsername = (EditText) findViewById(R.id.edtUsername);
        edtPassword = (EditText) findViewById(R.id.edtPassword);
        btnLogin = (Button) findViewById(R.id.btnLogin);
        userService = ApiUtils.getUserService();
        RadGrpLoginAs = (RadioGroup) findViewById(R.id.RadGrpLoginAs);

        btnLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String username = edtUsername.getText().toString();
                String password = edtPassword.getText().toString();
                //validate form
                int radioId = RadGrpLoginAs.getCheckedRadioButtonId();
                if (radioId==-1){
                    Toast.makeText(LoginActivity.this, "No answer has been selected", Toast.LENGTH_SHORT).show();
                }
                else {
                    RadioButton radioButton = (RadioButton) findViewById(radioId);
                    if (validateLogin(username, password)) {
                        //do login
                        String loginAs = "";
                        if (((String)radioButton.getText()).equals("Student")){
                            loginAs = "Student";
                        }
                        else if (((String)radioButton.getText()).equals("Instructor")){
                            loginAs = "Instructor";
                        }
                        else if(((String)radioButton.getText()).equals("TA")){
                            loginAs = "TA";
                        }
                        else{
                            goToLoginActivity();
                        }
                        doLogin(username, password, loginAs);
                    }
                }
            }
        });

    }

    private boolean validateLogin(String username, String password){
        if(username == null || username.trim().length() == 0){
            Toast.makeText(this, "Username is required", Toast.LENGTH_SHORT).show();
            return false;
        }
        if(password == null || password.trim().length() == 0){
            Toast.makeText(this, "Password is required", Toast.LENGTH_SHORT).show();
            return false;
        }
        return true;
    }

    private void doLogin(final String username,final String password, final String loginAs){
        sp = getSharedPreferences("login",MODE_PRIVATE);
        Call call = userService.loginReq(username, password, loginAs);
        call.enqueue(new Callback() {
            @Override
            public void onResponse(Call call, Response response) {
                if(response.isSuccessful()){
                    TokenObj tokenObj = (TokenObj) response.body();
                    if(tokenObj.getAuthToken()!=null){
                        //login start main activity
                        sp.edit().putString("authToken", tokenObj.getAuthToken()).apply();
                        sp.edit().putString("loginAs", loginAs).apply();

                        Intent i = new Intent(LoginActivity.this, MainActivity.class);
                        //i.putExtra("username", tokenObj.getName());
                        startActivity(i);

                    } else {
                        Toast.makeText(LoginActivity.this, "The username or password is incorrect", Toast.LENGTH_SHORT).show();
                    }
                } else {
                    Toast.makeText(LoginActivity.this, "The username or password is incorrect", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call call, Throwable t) {
                Toast.makeText(LoginActivity.this, t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    public void goToLoginActivity(){
        Intent i = new Intent(LoginActivity.this,LoginActivity.class);
        startActivity(i);
    }
}