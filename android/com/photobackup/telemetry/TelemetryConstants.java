package com.photobackup.telemetry;

public final class TelemetryConstants {
    private TelemetryConstants() {
        // No instancias
    }

    public static final class Level {
        private Level() {}
        public static final String INFO = "INFO";
        public static final String WARN = "WARN";
        public static final String ERROR = "ERROR";
        public static final String FATAL = "FATAL";
    }

    public static final class Module {
        private Module() {}
        public static final String BACKUP_SERVICE = "BackupService";
        public static final String PHOTO_OBSERVER = "PhotoObserver";
        public static final String CAMERA_FILE_OBSERVER = "CameraFileObserver";
        public static final String PHOTO_QUEUE_MANAGER = "PhotoQueueManager";
        public static final String FILE_COPIER = "FileCopier";
        public static final String ANDROID = "Android";
    }

    public static final class Event {
        private Event() {}
        public static final String SERVICE_CREATED = "SERVICE_CREATED";
        public static final String SERVICE_STARTED = "SERVICE_STARTED";
        public static final String SERVICE_DESTROYED = "SERVICE_DESTROYED";
        public static final String SERVICE_RESTARTED = "SERVICE_RESTARTED";
        public static final String SERVICE_TASK_REMOVED = "SERVICE_TASK_REMOVED";
        public static final String PHOTO_OBSERVER_STARTED = "PHOTO_OBSERVER_STARTED";
        public static final String PHOTO_OBSERVER_TRIGGERED = "PHOTO_OBSERVER_TRIGGERED";
        public static final String FILE_OBSERVER_STARTED = "FILE_OBSERVER_STARTED";
        public static final String FILE_OBSERVER_TRIGGERED = "FILE_OBSERVER_TRIGGERED";
        public static final String QUEUE_ADD = "QUEUE_ADD";
        public static final String QUEUE_PROCESS_START = "QUEUE_PROCESS_START";
        public static final String QUEUE_PROCESS_SUCCESS = "QUEUE_PROCESS_SUCCESS";
        public static final String QUEUE_PROCESS_FAILED = "QUEUE_PROCESS_FAILED";
        public static final String PHOTO_COPY_START = "PHOTO_COPY_START";
        public static final String PHOTO_COPY_SUCCESS = "PHOTO_COPY_SUCCESS";
        public static final String PHOTO_COPY_FAILED = "PHOTO_COPY_FAILED";
        public static final String SCREEN_ON = "SCREEN_ON";
        public static final String SCREEN_OFF = "SCREEN_OFF";
        public static final String USER_PRESENT = "USER_PRESENT";
        public static final String DEVICE_LOCKED = "DEVICE_LOCKED";
        public static final String IS_PENDING = "IS_PENDING";
        public static final String SECURITY_EXCEPTION = "SECURITY_EXCEPTION";
        public static final String FILE_NOT_FOUND = "FILE_NOT_FOUND";
        public static final String URI_INVALID = "URI_INVALID";
        public static final String UNKNOWN_ERROR = "UNKNOWN_ERROR";
    }
}
