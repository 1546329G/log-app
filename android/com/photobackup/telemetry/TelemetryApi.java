package com.photobackup.telemetry;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface TelemetryApi {
    @POST("api/logs")
    Call<TelemetryResponse> sendLog(@Body TelemetryLogRequest payload);
}
