package com.photobackup.telemetry;

import java.util.Map;

public class TelemetryLogRequest {
    public String level;
    public String module;
    public String event;
    public String message;
    public Map<String, Object> details_json;
    public String android_version;
    public String device_model;
    public String app_version;
    public Integer battery_level;
    public String screen_state;
    public String service_state;
    public String photo_uri;
    public String file_path;
    public Integer execution_time_ms;
}
