/**
 * ScheduleAPI - JavaScript библиотека для работы с API расписания
 * Версия: 1.0.0
 */

(function() {
    'use strict';
    
    // Глобальный объект библиотеки
    window.ScheduleAPI = {
        // Базовый URL API
        baseUrl: '',
        
        // Данные авторизации от Telegram
        initData: null,
        
        // Инициализация библиотеки
        init: function(baseUrl) {
            this.baseUrl = baseUrl;
            // Автоматически получаем initData из Telegram WebApp, если доступно
            if (typeof Telegram !== 'undefined' && Telegram.WebApp && Telegram.WebApp.initData) {
                this.initData = decodeURI( Telegram.WebApp.initData);
            }
            return this;
        },
        
        // Установка данных авторизации
        setInitData: function(initData) {
            this.initData = initData;
            return this;
        },
        
        // Отправка запроса к API
        request: function(type, params) {
            // Все запросы (кроме update) должны быть POST
            if (type !== 'update') {
                // Добавляем initData ко всем запросам, кроме статистики и аналитики
                if (type !== 'get_platform_stats' && type !== 'get_version_stats' && 
                    type !== 'get_hourly_stats' && type !== 'get_daily_stats' && type !== 'get_user_stats') {
                    if (!this.initData) {
                        return Promise.reject(new Error('Не установлены данные авторизации. Вызовите ScheduleAPI.setInitData() или убедитесь, что библиотека работает внутри Telegram WebApp.'));
                    }
                    params.init_data = this.initData;
                }
                
                // Отправляем POST запрос с JSON телом
                return fetch(this.baseUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(Object.assign({ type: type }, params))
                })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(data => {
                            throw new Error(data.error || 'Ошибка сервера');
                        });
                    }
                    return response.json();
                });
            } else {
                // Для update используем GET запрос
                const urlParams = new URLSearchParams(Object.assign({ type: type }, params));
                return fetch(`${this.baseUrl}?${urlParams.toString()}`, {
                    method: 'GET'
                })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(data => {
                            throw new Error(data.error || 'Ошибка сервера');
                        });
                    }
                    return response.json();
                });
            }
        },
        
        // ======================
        // ЭНДПОИНТЫ СТАТИСТИКИ
        // ======================
        
        // Статистика по платформам
        getPlatformStats: function() {
            return this.request('get_platform_stats', {});
        },
        
        // Статистика по версиям
        getVersionStats: function(platform) {
            return this.request('get_version_stats', platform ? { platform: platform } : {});
        },
        
        // Статистика по времени захода (часы)
        getHourlyStats: function() {
            return this.request('get_hourly_stats', {});
        },
        
        // Статистика по дням недели
        getDailyStats: function() {
            return this.request('get_daily_stats', {});
        },
        
        // Статистика по пользователям
        getUserStats: function() {
            return this.request('get_user_stats', {});
        },
        
        // ======================
        // ЭНДПОИНТ АНАЛИТИКИ
        // ======================
        
        // Сбор аналитики
        analytics: function(platform, telegramVersion) {
            const params = {
                platform: platform || (typeof Telegram !== 'undefined' ? Telegram.WebApp.platform : 'web'),
                telegram_version: telegramVersion || (typeof Telegram !== 'undefined' ? Telegram.WebApp.version : 'unknown')
            };
            return this.request('analytics', params);
        },
        
        // ======================
        // ЭНДПОИНТЫ ДЛЯ БАНОВ
        // ======================
        
        // Проверить статус бана пользователя
        getBanStatus: function(userId) {
            return this.request('get_ban_status', { user_id: userId });
        },
        
        // Забанить пользователя
        banUser: function(userId, reason) {
            return this.request('ban_user', { 
                user_id: userId, 
                reason: reason || 'Нарушение правил' 
            });
        },
        
        // Разбанить пользователя
        unbanUser: function(userId) {
            return this.request('unban_user', { user_id: userId });
        },
        
        // Получить список всех забаненных пользователей
        getBannedUsers: function() {
            return this.request('get_banned_users', {});
        },
        
        // Проверить является ли пользователь администратором
        checkAdmin: function() {
            return this.request('check_admin', {});
        },
        
        // ======================
        // ОСНОВНЫЕ ЭНДПОИНТЫ
        // ======================
        
        // Получить все факультеты
        getFaculties: function() {
            return this.request('get_faculties', {});
        },
        
        // Получить все группы по факультету
        getGroups: function(faculty) {
            if (!faculty) {
                return Promise.reject(new Error('Параметр "faculty" обязателен'));
            }
            return this.request('get_groups', { faculty: faculty });
        },
        
        // Получить расписание на текущую неделю
        getWeek: function(faculty, group) {
            if (!faculty || !group) {
                return Promise.reject(new Error('Параметры "faculty" и "group" обязательны'));
            }
            return this.request('get_week', { faculty: faculty, group: group });
        },
        
        // Получить расписание на конкретный день
        getDay: function(faculty, group, day) {
            if (!faculty || !group || !day) {
                return Promise.reject(new Error('Параметры "faculty", "group" и "day" обязательны'));
            }
            return this.request('get_day', { faculty: faculty, group: group, day: day });
        },
        
        // Получить расписание по дате
        getDate: function(faculty, group, date) {
            if (!faculty || !group || !date) {
                return Promise.reject(new Error('Параметры "faculty", "group" и "date" обязательны'));
            }
            return this.request('get_date', { faculty: faculty, group: group, date: date });
        },
        
        // Получить текущую пару
        getCurrentLesson: function(faculty, group) {
            if (!faculty || !group) {
                return Promise.reject(new Error('Параметры "faculty" и "group" обязательны'));
            }
            return this.request('get_current_lesson', { faculty: faculty, group: group });
        },
        
        // Получить список всех преподавателей
        getTeachers: function() {
            return this.request('get_teachers', {});
        },
        
        // Получить расписание преподавателя
        getTeacherSchedule: function(teacher, weekOffset) {
            if (!teacher) {
                return Promise.reject(new Error('Параметр "teacher" обязателен'));
            }
            const params = { teacher: teacher };
            if (weekOffset !== undefined) {
                params.week_offset = weekOffset;
            }
            return this.request('get_teacher_schedule', params);
        },
        
        // Получить все фото преподавателей
        getTeachersPhotos: function() {
            return this.request('get_teachers_photos', {});
        },
        
        // Получить фото конкретного преподавателя
        getTeacherPhoto: function(teacher) {
            if (!teacher) {
                return Promise.reject(new Error('Параметр "teacher" обязателен'));
            }
            return this.request('get_teacher_photo', { teacher: teacher });
        },
        
        // Статистика обновлений
        getStats: function() {
            return this.request('get_stats', {});
        },
        
        // Получить общую статистику
        getStatistics: function() {
            return this.request('get_statistics', {});
        },
        
        // Обновить расписание (только для cron, не рекомендуется вызывать из клиента)
        updateSchedule: function() {
            return this.request('update', {});
        },
        
        // Получить историю расписания для группы и даты
        getHistory: function(faculty, group, date) {
            if (!faculty || !group || !date) {
                return Promise.reject(new Error('Параметры "faculty", "group" и "date" обязательны'));
            }
            return this.request('get_history', { faculty: faculty, group: group, date: date });
        }
    };
    
    // Автоматическая инициализация, если указан атрибут data-api-url в теге скрипта
    document.addEventListener('DOMContentLoaded', function() {
        const script = document.querySelector('script[data-api-url]');
        if (script && script.dataset.apiUrl) {
            ScheduleAPI.init(script.dataset.apiUrl);
        }
    });
    
})();