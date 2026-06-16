const en = {
    translation: {
        current_language: 'Language',
        common: {
            submit: 'Submit',
            cancel: 'Cancel',
            del: 'Delete',
            exit: "Exit",
            change: "Change",
        },
        profile: {
            badge: "Caregiver",
            caregiverTabs: {
                selfTab: "See Self",
                patientTab: "See Patients"
            },
            infoTable: {
                headers: {
                    userInfo: "User Information",
                    persInfo: "Personal Information",
                    medInfo: "Medical Information",
                    medRecs: "Medical Records",
                    patientContact: "Contact",
                    sendPatientNote: "Send note to",
                    recOptions: "Record Options",
                    namedInfo: "Information",
                    namedContact: "Contact",
                },
                fields: {
                    fullName: "Full Name",
                    DOB: "Date of Birth",
                    address: "Address",
                    personalNum: "Personal Number",
                    emergNum: " Emergency Contact",
                    bloodType: "Blood Type",
                    genCond: "Genetic Conditions",
                    chronIll: "Chronic Illnesses",
                    allergies: "Allergies",
                    medication: "Medication",
                    RSD: "Recent Screening Date",
                    RSI: "Recent Sdreening Info",
                    caregiverID: "CaregiverID",
                    careNote: "Caregiver Note",
                    callPatient: "Call",
                },
            },
            buttons: {
                editBtn: "Edit Health Information",
                pharmBtn: "Pharmacy",
                hospitalBtn: "Hospital",
                clinicBtn: "Clinic",
                addPatientBtn: "Add Patient",
                clearCareNote: "Clear Caregiver Note",
                sendNote: "Send Note",
                rmUser: "Remove User",
            },
            headers: {
                assistPrompt: "Need to find assistance?",
                callPrompt: "CALL EMERGENCY CONTACT",
                addPatID: "Add Patient ID",
                patientHeader: "Patients"
            },
            misc: {
                findEmbed: "Find Nearby",
                noPatientsTxt: "No patients...",
                number404: "number doesnt exist",
            },
            errMsg: {
                missingPatTitle: "User could not be found",
                missingPatBody: "Delete Record of",
            },
            successMsg: {
                noteSentPrefix: "The note to",
                noteSentSuffix: "was sent successfully",
            },
        },

        settings: {
            headers: {
                pageName: "Settings",
                appOpt: "App Options",
                accInfo: "Account Information",
                accOpt: "Account Options",
                logout: 'Logout',
                terminate: "Terminate Account",

            },
            settingsFields: {
                email: "User Email",
                accID: "Account ID",
                accDate: "Account Date",
                reveal: {
                    fals: "Reveal Account Information",
                    tru: "Hide Account Information",
                },
                caregiverReg: "Account Registered As A Caregiver"

            },
            darkMode: {
                dark: "Dark Mode",
                light: "Light Mode",
            },
            buttons: {
                changeEmailBtn: "Change Email",
                changePasswdBtn: "Change Password",
                logoutBtn: "Exit",
                terminateBtn: "DELETE ACCOUNT",
            },
            modals: {
                email: {
                    title: "Change Email",
                    email: "Email",
                    passwd: "Password",
                },
                passwd: {
                    title: "Change Password",
                    oldPasswd: "Old\nPassword",
                    newPasswd: "New\nPassword",
                    confirmPasswd: "Confirm\nPassword",
                },
                delAcc: {
                    header: "Delete Account?",
                    title: "Tis action is permanent",
                    body: "Both the account and its data will be deleted",
                },
                caregiver: {
                    optIn: {
                        title: "Register as a Caregiver?",
                        body: "This will create your caregiver profile and allow you to manage dependents.",
                        optInBtn: "Opt In",
                    },
                    optOut: {
                        title: "Opt out as Caregiver?",
                        body: "This will remove your caregiver profile and all dependent data.",
                        warning: "This action cannot be undone.",
                        optOutBtn: "Opt Out",
                    },
                },
            },

            errMsg: {
                updateEmail:{
                    email: "Please enter an Email",
                    passwd: "Please enter your password",
                },
                updatePass: {
                    passwd: "Please enter your current password",
                    newPasswd: "please fill in both new password fields",
                    passwdNoMatch: "New Passwords do not match",
                },
            },
            announcements: {
                prefix: {
                email: "Email",
                passwd: "Password"
                },
                suffix: "changed successfully",
            },
        },


        create: {
            dropdownFields: {
                mainModes: {
                    oneTime: "One Time",
                    daily: "Daily",
                    weekly: "Weekly",
                    monthly: "Monthly",
                },
                weeklyDays: {
                    sunday: 'Sunday',
                    monday: 'Monday',
                    tuesday: 'Tuesday',
                    wednesday: 'Wednesday',
                    thursday: 'Thursday',
                    friday: 'Friday',
                    saturday: 'Saturday',
                },
                months: {
                    january: "January",
                    february: "February",
                    march: "March",
                    april: "April",
                    may: "May",
                    june: "June",
                    july: "July",
                    august: "August",
                    september: "September",
                    october: "October",
                    november: "November",
                    december: "December",
                },
                subDropdownNames: {
                    month: "Month",
                    day: "Day",
                    hour: "Hour:",
                    minute: "Minute",
                    weekDay: "Week Day",
                },
            },
            buttons: {
                scheduleNotifBtn: "Set Notification",
            },
            headers: {
                notifSchedule: "Schedule Notification",
                notifTitle: "Notificaiton Title",
                notifBody: "Notification Body",
                notifType: "Notification Type",
            },
            placeholders: {
                notifTitle: "Notification title",
                notifBody: "notification body",
            },
            misc: {
                emptyNotif: "Select notification type",
            },

            errMsg: {
                notifTitle: "Please enter a notification title\n",
                notifMin: "Choose value from 'Hour' field\n",
                notifHr: "Choose value from 'Minute' field\n",
                notifWeekDay: "Choose value from 'Week day' field\n",
                notifDay: "Choose value from 'Day' field\n",
                notifMonth: "Choose value from 'Month' field\n",

            },
        },

        reminders: {
            headers: {
                pageHeader: "Your Reminders",
                notifDetails: "Notification Details",
                dellAllHeader: "Delete all notifications?",
            },
            cardFields: {
                type: "Type",
                month: "Month",
                day: "Day",
                hour: "Hour",
                minute: "Minute",
                weekDay: "Week Day",
                date: "Date",
                time: "Time",
            },
            buttons: {
                delAllBtn: "Delete all Notifications"
            },
            misc: {
                emptyNotifs: "No scheduled notifications"
            },
        },

        dashboard: {
            reminders: "Reminders",
            create: "Create",
            profile: "Profile",
            settings: "Settings",
        },

        login: {
            pageHeader: "Log in to your account",
            email: "Email",
            passwd: "Password",
            forgotLink: "Forgot your password?",
            loginBtn: "Login",
            registerLink: "Don't have an account? Register instead!",
        },
        register: {
            pageHeader: "Register for an account",
            email: "Email",
            passwd: "Password",
            registerBtn: "Register",
            loginLink: "Don't have an account? Register instead!",
        },

    }
}

export default en;