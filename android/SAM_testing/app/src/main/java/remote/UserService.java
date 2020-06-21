package remote;

import android.database.Observable;

import java.util.List;

import model.ResObj;
import model.StudentCourseDetailsObj;
import model.CourseObj;
import model.TokenObj;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.Part;
import retrofit2.http.Query;

import static android.R.attr.id;

/**
 * Created by SAHIL on 06-06-2020.
 */

public interface UserService {

    //@GET("api/posts/{username}")
    //Call<ResObj> posts(@Header("Authorization") String authToken, @Path("username") String username);

    @GET("api/posts")
    Call<ResObj> posts(@Header("Authorization") String authToken);

    @GET("api/student/get_courses")
    Call<List<CourseObj>> Courses(@Header("Authorization") String authToken);

    @GET("api/student/get_course_details")
    Call<StudentCourseDetailsObj> studentCourseDetails(@Header("Authorization") String authToken, @Query("class") String classInfoId);

    @FormUrlEncoded
    @POST("api/login")
    Call<TokenObj> loginReq(@Field("username") String username, @Field("password") String password, @Field("loginAs") String loginAs);

    @Multipart
    @POST("api/instructor/takeAttendance")
    Observable<Void> takeAttendance(@Header("Authorization") String authToken, @Part("classInfoId") String classInfoId, @Part MultipartBody.Part image);
}