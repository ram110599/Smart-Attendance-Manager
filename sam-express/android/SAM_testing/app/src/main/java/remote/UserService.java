package remote;

import model.ResObj;
import model.TokenObj;
import retrofit2.Call;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Headers;
import retrofit2.http.POST;
import retrofit2.http.Path;

/**
 * Created by SAHIL on 06-06-2020.
 */

public interface UserService {

    //@GET("api/posts/{username}")
    //Call<ResObj> posts(@Header("Authorization") String authToken, @Path("username") String username);

    @GET("api/posts")
    Call<ResObj> posts(@Header("Authorization") String authToken);

    @FormUrlEncoded
    @POST("api/login")
    Call<TokenObj> loginReq(@Field("username") String username, @Field("password") String password);

}