/*
 * VSU Shedule App | Version [build_version]
 * Build: [build_info]
 * Developer: @whoennrl
 * 
 * Site: https://whoennrl.ru
 */

(function () {
    'use strict';


    window.ScheduleAPI = {

        baseUrl: '',


        initData: null,


        init: function (baseUrl) {
            this.baseUrl = baseUrl;

            if (typeof Telegram !== 'undefined' && Telegram.WebApp && Telegram.WebApp.initData) {
                this.initData = decodeURI(Telegram.WebApp.initData);
            }
            return this;
        },


        setInitData: function (initData) {
            this.initData = initData;
            return this;
        },


        request: function (type, params) {

            if (type !== 'update') {


                if (!this.initData) {
                    return Promise.reject(new Error('Не установлены данные авторизации. Вызовите ScheduleAPI.setInitData() или убедитесь, что библиотека работает внутри Telegram WebApp.'));
                }
                params.init_data = this.initData;



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






        getPlatformStats: function () {
            return this.request('get_platform_stats', {});
        },


        getVersionStats: function (platform) {
            return this.request('get_version_stats', platform ? { platform: platform } : {});
        },
        getAllUsers: function () {
            return this.request('get_all_users', {});
        },


        getHourlyStats: function () {
            return this.request('get_hourly_stats', {});
        },


        getDailyStats: function () {
            return this.request('get_daily_stats', {});
        },


        getUserStats: function () {
            return this.request('get_user_stats', {});
        },






        analytics: function (platform, telegramVersion) {
            const params = {
                platform: platform || (typeof Telegram !== 'undefined' ? Telegram.WebApp.platform : 'web'),
                telegram_version: telegramVersion || (typeof Telegram !== 'undefined' ? Telegram.WebApp.version : 'unknown')
            };
            return this.request('analytics', params);
        },






        getBanStatus: function (userId) {
            return this.request('get_ban_status', { user_id: userId });
        },


        banUser: function (userId, reason) {
            return this.request('ban_user', {
                user_id: userId,
                reason: reason || 'Нарушение правил'
            });
        },


        unbanUser: function (userId) {
            return this.request('unban_user', { user_id: userId });
        },


        getBannedUsers: function () {
            return this.request('get_banned_users', {});
        },


        checkAdmin: function () {
            return this.request('check_admin', {});
        },






        getFaculties: function () {
            return this.request('get_faculties', {});
        },


        getGroups: function (faculty) {
            if (!faculty) {
                return Promise.reject(new Error('Параметр "faculty" обязателен'));
            }
            return this.request('get_groups', { faculty: faculty });
        },


        getWeek: function (faculty, group) {
            if (!faculty || !group) {
                return Promise.reject(new Error('Параметры "faculty" и "group" обязательны'));
            }
            return this.request('get_week', { faculty: faculty, group: group });
        },


        getDay: function (faculty, group, day) {
            if (!faculty || !group || !day) {
                return Promise.reject(new Error('Параметры "faculty", "group" и "day" обязательны'));
            }
            return this.request('get_day', { faculty: faculty, group: group, day: day });
        },


        getDate: function (faculty, group, date) {
            if (!faculty || !group || !date) {
                return Promise.reject(new Error('Параметры "faculty", "group" и "date" обязательны'));
            }
            return this.request('get_date', { faculty: faculty, group: group, date: date });
        },


        getCurrentLesson: function (faculty, group) {
            if (!faculty || !group) {
                return Promise.reject(new Error('Параметры "faculty" и "group" обязательны'));
            }
            return this.request('get_current_lesson', { faculty: faculty, group: group });
        },


        getTeachers: function () {
            return this.request('get_teachers', {});
        },


        getTeacherSchedule: function (teacher, weekOffset) {
            if (!teacher) {
                return Promise.reject(new Error('Параметр "teacher" обязателен'));
            }
            const params = { teacher: teacher };
            if (weekOffset !== undefined) {
                params.week_offset = weekOffset;
            }
            return this.request('get_teacher_schedule', params);
        },


        getTeachersPhotos: function () {
            return this.request('get_teachers_photos', {});
        },


        getTeacherPhoto: function (teacher) {
            if (!teacher) {
                return Promise.reject(new Error('Параметр "teacher" обязателен'));
            }
            return this.request('get_teacher_photo', { teacher: teacher });
        },


        getStats: function () {
            return this.request('get_stats', {});
        },


        getStatistics: function () {
            return this.request('get_statistics', {});
        },


        updateSchedule: function () {
            return this.request('update', {});
        },


        getHistory: function (faculty, group, date) {
            if (!faculty || !group || !date) {
                return Promise.reject(new Error('Параметры "faculty", "group" и "date" обязательны'));
            }
            return this.request('get_history', { faculty: faculty, group: group, date: date });
        }
    };


    document.addEventListener('DOMContentLoaded', function () {
        const script = document.querySelector('script[data-api-url]');
        if (script && script.dataset.apiUrl) {
            ScheduleAPI.init(script.dataset.apiUrl);
        }
    });

})();