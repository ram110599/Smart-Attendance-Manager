package a2016csb1057.iitrpr.ac.in.sam_testing;

import android.Manifest;
import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Environment;
import android.os.StrictMode;
import android.provider.MediaStore;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

import javax.net.ssl.HttpsURLConnection;

import static a2016csb1057.iitrpr.ac.in.sam_testing.R.id.imageView;
import static android.R.attr.data;

public class InstructorTakeAttendActivity extends AppCompatActivity {
    Button CaptureImageFromCamera,UploadImageToServer;
    ImageView ImageViewHolder;
    private String imageFileName = "temp.jpg";
    public  static final int RequestPermissionCode  = 1 ;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_instructor_take_attend);
        StrictMode.VmPolicy.Builder builder = new StrictMode.VmPolicy.Builder();
        StrictMode.setVmPolicy(builder.build());

        CaptureImageFromCamera = (Button)findViewById(R.id.button);
        ImageViewHolder = (ImageView)findViewById(imageView);
        UploadImageToServer = (Button) findViewById(R.id.button2);

        EnableRuntimePermissionToAccessCamera();

        CaptureImageFromCamera.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if ((ActivityCompat.checkSelfPermission(InstructorTakeAttendActivity.this, Manifest.permission.CAMERA)!=PackageManager.PERMISSION_GRANTED) || (ActivityCompat.checkSelfPermission(InstructorTakeAttendActivity.this, Manifest.permission.WRITE_EXTERNAL_STORAGE)!=PackageManager.PERMISSION_GRANTED) || (ActivityCompat.checkSelfPermission(InstructorTakeAttendActivity.this, Manifest.permission.READ_EXTERNAL_STORAGE)!=PackageManager.PERMISSION_GRANTED) || (ActivityCompat.checkSelfPermission(InstructorTakeAttendActivity.this, Manifest.permission.ACCESS_NETWORK_STATE)!=PackageManager.PERMISSION_GRANTED)) {
                    ActivityCompat.requestPermissions(InstructorTakeAttendActivity.this, new String[]{Manifest.permission.CAMERA, Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.READ_EXTERNAL_STORAGE, Manifest.permission.ACCESS_NETWORK_STATE}, RequestPermissionCode);
                    if ((ActivityCompat.checkSelfPermission(InstructorTakeAttendActivity.this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) || (ActivityCompat.checkSelfPermission(InstructorTakeAttendActivity.this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) || (ActivityCompat.checkSelfPermission(InstructorTakeAttendActivity.this, Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) || (ActivityCompat.checkSelfPermission(InstructorTakeAttendActivity.this, Manifest.permission.ACCESS_NETWORK_STATE) != PackageManager.PERMISSION_GRANTED)) {
                        Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                        /*File f = new File(android.os.Environment.getExternalStorageDirectory(), imageFileName);
                        intent.putExtra(MediaStore.EXTRA_OUTPUT, Uri.fromFile(f));*/
                        startActivityForResult(intent, 1);
                    }
                }
                else {
                    /*intent = new Intent(android.provider.MediaStore.ACTION_IMAGE_CAPTURE);
                    startActivityForResult(intent, 7);*/
                    Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                    /*File f = new File(android.os.Environment.getExternalStorageDirectory(), imageFileName);
                    intent.putExtra(MediaStore.EXTRA_OUTPUT, Uri.fromFile(f));*/
                    startActivityForResult(intent, 1);
                }
            }
        });
        UploadImageToServer.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                /*GetImageNameFromEditText = imageName.getText().toString();
                ImageUploadToServerFunction();*/
                Toast.makeText(InstructorTakeAttendActivity.this,"No picture selected", Toast.LENGTH_SHORT).show();
            }
        });

    }

    // Star activity for result method to Set captured image on image view after click.
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == 1 && resultCode == Activity.RESULT_OK)
        {
            Bitmap photo = (Bitmap) data.getExtras().get("data");
            ImageViewHolder.setImageBitmap(photo);
            UploadImageToServer.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                /*GetImageNameFromEditText = imageName.getText().toString();
                ImageUploadToServerFunction();*/
                    Toast.makeText(InstructorTakeAttendActivity.this,"Now its okkk", Toast.LENGTH_LONG).show();
                }
            });
        }
        /*super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == RESULT_OK) {
            if (requestCode == 1) {
                File f = new File(Environment.getExternalStorageDirectory().toString());
                for (File temp : f.listFiles()) {
                    if (temp.getName().equals(imageFileName)) {
                        f = temp;
                        break;
                    }
                }
                try {
                    Bitmap bitmap;
                    BitmapFactory.Options bitmapOptions = new BitmapFactory.Options();
                    bitmap = BitmapFactory.decodeFile(f.getAbsolutePath(), bitmapOptions);
                    bitmap=getResizedBitmap(bitmap, 400);
                    ImageViewHolder.setImageBitmap(bitmap);
                    BitMapToString(bitmap);
                    String path = android.os.Environment
                            .getExternalStorageDirectory()
                            + File.separator
                            + "Phoenix" + File.separator + "default";
                    f.delete();
                    OutputStream outFile = null;
                    File file = new File(path, String.valueOf(System.currentTimeMillis()) + ".jpg");
                    try {
                        outFile = new FileOutputStream(file);
                        bitmap.compress(Bitmap.CompressFormat.JPEG, 85, outFile);
                        outFile.flush();
                        outFile.close();
                    } catch (FileNotFoundException e) {
                        e.printStackTrace();
                    } catch (IOException e) {
                        e.printStackTrace();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else if (requestCode == 2) {
                Uri selectedImage = data.getData();
                String[] filePath = { MediaStore.Images.Media.DATA };
                Cursor c = getContentResolver().query(selectedImage,filePath, null, null, null);
                c.moveToFirst();
                int columnIndex = c.getColumnIndex(filePath[0]);
                String picturePath = c.getString(columnIndex);
                c.close();
                Bitmap thumbnail = (BitmapFactory.decodeFile(picturePath));
                thumbnail=getResizedBitmap(thumbnail, 400);
                //Log.w("path of image from gallery......******************.........", picturePath+"");
                ImageViewHolder.setImageBitmap(thumbnail);
                BitMapToString(thumbnail);
            }
        }*/
    }

    public String BitMapToString(Bitmap userImage1) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        userImage1.compress(Bitmap.CompressFormat.PNG, 60, baos);
        byte[] b = baos.toByteArray();
        String Document_img1 = "";
        Document_img1 = Base64.encodeToString(b, Base64.DEFAULT);
        return Document_img1;
    }

    public Bitmap getResizedBitmap(Bitmap image, int maxSize) {
        int width = image.getWidth();
        int height = image.getHeight();

        float bitmapRatio = (float)width / (float) height;
        if (bitmapRatio > 1) {
            width = maxSize;
            height = (int) (width / bitmapRatio);
        } else {
            height = maxSize;
            width = (int) (height * bitmapRatio);
        }
        return Bitmap.createScaledBitmap(image, width, height, true);
    }

    // Requesting runtime permission to access camera.
    public void EnableRuntimePermissionToAccessCamera(){

        if ((ActivityCompat.checkSelfPermission(InstructorTakeAttendActivity.this, Manifest.permission.CAMERA)!=PackageManager.PERMISSION_GRANTED) || (ActivityCompat.checkSelfPermission(InstructorTakeAttendActivity.this, Manifest.permission.WRITE_EXTERNAL_STORAGE)!=PackageManager.PERMISSION_GRANTED) || (ActivityCompat.checkSelfPermission(InstructorTakeAttendActivity.this, Manifest.permission.READ_EXTERNAL_STORAGE)!=PackageManager.PERMISSION_GRANTED) || (ActivityCompat.checkSelfPermission(InstructorTakeAttendActivity.this, Manifest.permission.ACCESS_NETWORK_STATE)!=PackageManager.PERMISSION_GRANTED)){
            ActivityCompat.requestPermissions(InstructorTakeAttendActivity.this, new String[]{Manifest.permission.CAMERA, Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.READ_EXTERNAL_STORAGE, Manifest.permission.ACCESS_NETWORK_STATE}, RequestPermissionCode);
        }
        /*if (ActivityCompat.shouldShowRequestPermissionRationale(InstructorTakeAttendActivity.this, Manifest.permission.CAMERA))
        {
            // Printing toast message after enabling runtime permission.
            Toast.makeText(InstructorTakeAttendActivity.this,"CAMERA permission allows us to Access CAMERA app", Toast.LENGTH_LONG).show();
        } else {
            ActivityCompat.requestPermissions(InstructorTakeAttendActivity.this,new String[]{Manifest.permission.CAMERA}, RequestPermissionCode);
        }*/
    }

    // Upload captured image online on server function.
    public void ImageUploadToServerFunction(){

    }


    @Override
    public void onRequestPermissionsResult(int RC, String per[], int[] PResult) {
        switch (RC) {
            case RequestPermissionCode:
                if (PResult.length > 0 && PResult[0] == PackageManager.PERMISSION_GRANTED) {
                    Toast.makeText(InstructorTakeAttendActivity.this,"Your application can access CAMERA.", Toast.LENGTH_LONG).show();
                } else{
                    Toast.makeText(InstructorTakeAttendActivity.this,"CAMERA permission denied! CAMERA is required.", Toast.LENGTH_LONG).show();
                }
                if (PResult.length > 1 && PResult[1] == PackageManager.PERMISSION_GRANTED) {
                    Toast.makeText(InstructorTakeAttendActivity.this,"Your application can access STORAGE.", Toast.LENGTH_LONG).show();
                } else{
                    Toast.makeText(InstructorTakeAttendActivity.this,"WRITE STORAGE permission denied! access STORAGE is required.", Toast.LENGTH_LONG).show();
                }
                break;
        }
    }
}