package com.carefleet.dto;

public class AmbulanceDto {
    private String id;
    private String licensePlate;
    private String driverId;
    private String status;
    private LocationDto currentLocation;
    private String destinationHospitalId;
    private boolean patientOnBoard;
    private String createdAt;
    private String updatedAt;

    public static class LocationDto {
        private double latitude;
        private double longitude;
        private String timestamp;

        // Getters and setters
        public double getLatitude() { return latitude; }
        public void setLatitude(double latitude) { this.latitude = latitude; }

        public double getLongitude() { return longitude; }
        public void setLongitude(double longitude) { this.longitude = longitude; }

        public String getTimestamp() { return timestamp; }
        public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getLicensePlate() { return licensePlate; }
    public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }

    public String getDriverId() { return driverId; }
    public void setDriverId(String driverId) { this.driverId = driverId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocationDto getCurrentLocation() { return currentLocation; }
    public void setCurrentLocation(LocationDto currentLocation) { this.currentLocation = currentLocation; }

    public String getDestinationHospitalId() { return destinationHospitalId; }
    public void setDestinationHospitalId(String destinationHospitalId) { this.destinationHospitalId = destinationHospitalId; }

    public boolean isPatientOnBoard() { return patientOnBoard; }
    public void setPatientOnBoard(boolean patientOnBoard) { this.patientOnBoard = patientOnBoard; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
}