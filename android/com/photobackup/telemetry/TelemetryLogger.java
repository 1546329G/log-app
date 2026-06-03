package com.photobackup.telemetry;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.BatteryManager;
import android.os.Build;
import android.util.Log;

import java.util.HashMap;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class TelemetryLogger {
    private static final String TAG = "TelemetryLogger";
    private static final String BASE_URL = "https://log-app.gandywilliam.dev/";
    private static TelemetryLogger instance;

    private final TelemetryApi telemetryApi;
    private final String deviceModel;
    private final String androidVersion;
    private final String appVersion;
    private final Context context;

    private TelemetryLogger(Context context) {
        this.context = context.getApplicationContext();
        this.deviceModel = Build.MODEL;
        this.androidVersion = Build.VERSION.RELEASE;
        this.appVersion = getAppVersion(context);

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        telemetryApi = retrofit.create(TelemetryApi.class);
    }

    public static synchronized void init(Context context) {
        if (instance == null) {
            instance = new TelemetryLogger(context);
        }
    }

    public static TelemetryLogger getInstance() {
        if (instance == null) {
            throw new IllegalStateException("TelemetryLogger must be initialized before use. Call TelemetryLogger.init(context).");
        }
        return instance;
    }

    public void logInfo(String module, String event, String message) {
        log(TelemetryConstants.Level.INFO, module, event, message, null);
    }

    public void logInfo(String module, String event, String message, Map<String, Object> details) {
        log(TelemetryConstants.Level.INFO, module, event, message, details);
    }

    public void logWarning(String module, String event, String message) {
        log(TelemetryConstants.Level.WARN, module, event, message, null);
    }

    public void logWarning(String module, String event, String message, Map<String, Object> details) {
        log(TelemetryConstants.Level.WARN, module, event, message, details);
    }

    public void logError(String module, String event, String message) {
        log(TelemetryConstants.Level.ERROR, module, event, message, null);
    }

    public void logError(String module, String event, String message, Map<String, Object> details) {
        log(TelemetryConstants.Level.ERROR, module, event, message, details);
    }

    public void logFatal(String module, String event, String message) {
        log(TelemetryConstants.Level.FATAL, module, event, message, null);
    }

    public void logFatal(String module, String event, String message, Map<String, Object> details) {
        log(TelemetryConstants.Level.FATAL, module, event, message, details);
    }

    public void logError(String module, String event, String message, Throwable throwable) {
        Map<String, Object> details = new HashMap<>();
        details.put("exception_class", throwable.getClass().getSimpleName());
        details.put("stack_trace", Log.getStackTraceString(throwable));
        log(TelemetryConstants.Level.ERROR, module, event, message, details);
    }

    public void logFatal(String module, String event, String message, Throwable throwable) {
        Map<String, Object> details = new HashMap<>();
        details.put("exception_class", throwable.getClass().getSimpleName());
        details.put("stack_trace", Log.getStackTraceString(throwable));
        log(TelemetryConstants.Level.FATAL, module, event, message, details);
    }

    private void log(String level, String module, String event, String message, Map<String, Object> details) {
        TelemetryLogRequest payload = new TelemetryLogRequest();
        payload.level = level;
        payload.module = module;
        payload.event = event;
        payload.message = message;
        payload.details_json = details != null ? details : new HashMap<>();
        payload.device_model = deviceModel;
        payload.android_version = androidVersion;
        payload.app_version = appVersion;
        payload.battery_level = getBatteryLevel();
        payload.screen_state = null;
        payload.service_state = null;
        payload.photo_uri = null;
        payload.file_path = null;
        payload.execution_time_ms = null;

        telemetryApi.sendLog(payload).enqueue(new Callback<TelemetryResponse>() {
            @Override
            public void onResponse(Call<TelemetryResponse> call, Response<TelemetryResponse> response) {
                if (!response.isSuccessful()) {
                    Log.w(TAG, "Telemetry API returned non-success code: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<TelemetryResponse> call, Throwable t) {
                Log.w(TAG, "Telemetry send failed", t);
            }
        });
    }

    private String getAppVersion(Context context) {
        try {
            PackageManager pm = context.getPackageManager();
            if (pm == null) {
                return "unknown";
            }
            PackageInfo packageInfo = pm.getPackageInfo(context.getPackageName(), 0);
            return packageInfo.versionName != null ? packageInfo.versionName : String.valueOf(packageInfo.versionCode);
        } catch (PackageManager.NameNotFoundException e) {
            Log.w(TAG, "Unable to get app version", e);
            return "unknown";
        }
    }

    private Integer getBatteryLevel() {
        try {
            Intent batteryIntent = context.registerReceiver(null, new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
            if (batteryIntent == null) {
                return null;
            }
            int level = batteryIntent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
            int scale = batteryIntent.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
            if (level < 0 || scale <= 0) {
                return null;
            }
            return Math.round((level * 100f) / scale);
        } catch (Exception e) {
            Log.w(TAG, "Unable to read battery level", e);
            return null;
        }
    }
}
