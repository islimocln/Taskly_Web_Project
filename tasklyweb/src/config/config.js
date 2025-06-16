export const config = {
    API_BASE_URL: 'http://172.25.224.1:5055/api',
    // Diğer konfigürasyon değerleri buraya eklenebilir
    AUTH_TOKEN_KEY: 'taskly_auth_token',
    API_TIMEOUT: 30000, // 30 saniye
    JWT: {
        TOKEN_PREFIX: 'Bearer ',
        TOKEN_HEADER: 'Authorization'
    }
}; 