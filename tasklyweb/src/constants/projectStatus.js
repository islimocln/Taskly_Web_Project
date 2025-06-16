export const ProjectStatus = {
    Beklemede: 1,
    Aktif: 2,
    Tamamlandi: 3
};

export const ProjectStatusText = {
    [ProjectStatus.Beklemede]: 'Beklemede',
    [ProjectStatus.Aktif]: 'Aktif',
    [ProjectStatus.Tamamlandi]: 'Tamamlandı'
};

export const ProjectStatusColor = {
    [ProjectStatus.Beklemede]: 'warning',
    [ProjectStatus.Aktif]: 'success',
    [ProjectStatus.Tamamlandi]: 'primary'
}; 