const ro = {
    translation: {
        current_language: 'Limbă',
        common: {
            submit: 'Trimite',
            cancel: 'Anulează',
            del: 'Șterge',
            exit: "Ieșire",
            change: "Schimbă",
        },
        profile: {
            badge: "Îngrijitor",
            caregiverTabs: {
                selfTab: "Profil",
                patientTab: "Pacienți"
            },
            infoTable: {
                headers: {
                    userInfo: "Informații Utilizator",
                    persInfo: "Informații Personale",
                    medInfo: "Informații Medicale",
                    medRecs: "Dosare Medicale",
                    patientContact: "Contact",
                    sendPatientNote: "Trimite un mesaj către",
                    recOptions: "Opțiuni Dosar",
                    namedInfo: "Informații",
                    namedContact: "Contactați",
                },
                fields: {
                    fullName: "Nume Complet",
                    DOB: "Data Nașterii",
                    address: "Adresă",
                    personalNum: "Număr Tel. Personal",
                    emergNum: "Contact de Urgență",
                    bloodType: "Grupa Sanguină",
                    genCond: "Afecțiuni Genetice",
                    chronIll: "Boli Cronice",
                    allergies: "Alergii",
                    medication: "Medicamente",
                    RSD: "Data Ultimului Control Medical",
                    RSI: "Informații Ultimul Control Medical",
                    caregiverID: "ID Îngrijitor",
                    careNote: "Notă Îngrijitor",
                    callPatient: "Sună",
                },
            },
            buttons: {
                editBtn: "Editează Informațiile Medicale",
                pharmBtn: "Farmacie",
                hospitalBtn: "Spital",
                clinicBtn: "Clinică",
                addPatientBtn: "Adaugă Pacient",
                clearCareNote: "Ștergeți mesajul îngrijitorului",
                sendNote: "Trimiteți mesaj",
                rmUser: "Eliminați Utilizatorul",
            },
            headers: {
                assistPrompt: "Ai nevoie de asistență?",
                callPrompt: "SUNĂ CONTACTUL DE URGENȚĂ",
                addPatID: "Adaugă ID Pacient",
                patientHeader: "Pacienți"
            },
            misc: {
                findEmbed: "Găsește în Apropiere",
                noPatientsTxt: "Nu există pacienți...",
                number404: "Numărul nu există",
            },
            errMsg: {
                missingPatTitle: "Utilizatorul nu a fost găsit",
                missingPatBody: "Șterge dosarul pacientului",
            },
            successMsg: {
                noteSentPrefix: "Mesajul către",
                noteSentSuffix: "a fost trimis cu succes",
            },
        },

        settings: {
            headers: {
                pageName: "Setări",
                appOpt: "Opțiuni Aplicație",
                accInfo: "Informații Cont",
                accOpt: "Opțiuni Cont",
                logout: 'Deconectare',
                terminate: "Închidere Cont",

            },
            settingsFields: {
                email: "Email Utilizator",
                accID: "ID Cont",
                accDate: "Data Creării Contului",
                reveal: {
                    fals: "Arată Informațiile Contului",
                    tru: "Ascunde Informațiile Contului",
                },
                caregiverReg: "Cont Înregistrat ca Îngrijitor"

            },
            darkMode: {
                dark: "Mod Întunecat",
                light: "Mod Luminos",
            },
            buttons: {
                changeEmailBtn: "Schimbă Email",
                changePasswdBtn: "Schimbă Parola",
                logoutBtn: "Ieșire",
                terminateBtn: "ȘTERGE CONTUL",
            },
            modals: {
                email: {
                    title: "Schimbă Email",
                    email: "Email",
                    passwd: "Parolă",
                },
                passwd: {
                    title: "Schimbă Parola",
                    oldPasswd: "Parola\nVeche",
                    newPasswd: "Parola\nNouă",
                    confirmPasswd: "Confirmă\nParola",
                },
                delAcc: {
                    header: "Ștergeți Contul?",
                    title: "Această acțiune este permanentă",
                    body: "Atât contul, cât și datele sale vor fi șterse",
                },
                caregiver: {
                    optIn: {
                        title: "Vă înregistrați ca Îngrijitor?",
                        body: "Acest lucru va crea profilul de îngrijitor și vă va permite să gestionați persoanele dependente.",
                        optInBtn: "Înscrie-te",
                    },
                    optOut: {
                        title: "Renunțați la calitatea de Îngrijitor?",
                        body: "Acest lucru va șterge profilul de îngrijitor și toate datele persoanelor dependente.",
                        warning: "Această acțiune este ireversibilă.",
                        optOutBtn: "Renunță",
                    },
                },
            },

            errMsg: {
                updateEmail:{
                    email: "Vă rugăm să introduceți un Email",
                    passwd: "Vă rugăm să introduceți parola",
                },
                updatePass: {
                    passwd: "Vă rugăm să introduceți parola curentă",
                    newPasswd: "Vă rugăm să completați ambele câmpuri pentru parola nouă",
                    passwdNoMatch: "Parolele noi nu se potrivesc",
                },
            },
            announcements: {
                prefix: {
                    email: "Email-ul",
                    passwd: "Parola"
                },
                suffix: "schimbat cu succes",
            },
        },

        create: {
            dropdownFields: {
                mainModes: {
                    oneTime: "O singură dată",
                    daily: "Zilnic",
                    weekly: "Săptămânal",
                    monthly: "Lunar",
                },
                weeklyDays: {
                    sunday: 'Duminică',
                    monday: 'Luni',
                    tuesday: 'Marți',
                    wednesday: 'Miercuri',
                    thursday: 'Joi',
                    friday: 'Vineri',
                    saturday: 'Sâmbătă',
                },
                months: {
                    january: "Ianuarie",
                    february: "Februarie",
                    march: "Martie",
                    april: "Aprilie",
                    may: "Mai",
                    june: "Iunie",
                    july: "Iulie",
                    august: "August",
                    september: "Septembrie",
                    october: "Octombrie",
                    november: "Noiembrie",
                    december: "Decembrie",
                },
                subDropdownNames: {
                    month: "Lună",
                    day: "Zi",
                    hour: "Oră:",
                    minute: "Minut",
                    weekDay: "Ziua\nSăptămânii",
                },
            },
            buttons: {
                scheduleNotifBtn: "Setează Reamintire",
            },
            headers: {
                notifSchedule: "Programare Reamintiri",
                notifTitle: "Titlul Notificării",
                notifBody: "Corpul Notificării",
                notifType: "Tipul Notificării",
            },
            placeholders: {
                notifTitle: "Numele reamintirii",
                notifBody: "Corpul Reamintirii",
            },
            misc: {
                emptyNotif: "Selectează un tip de notificare",
            },
            errMsg: {
                notifTitle: "Introduceți un titlu pentru notificare\n",
                notifMin: "Alege o valoare din câmpul 'Minut'\n",
                notifHr: "Alege o valoare din câmpul 'Oră'\n",
                notifWeekDay: "Alege o valoare din câmpul 'Ziua săptămânii'\n",
                notifDay: "Alege o valoare din câmpul 'Zi'\n",
                notifMonth: "Alege o valoare din câmpul 'Lună'\n",
            },
        },

        reminders: {
            headers: {
                pageHeader: "Reamintirile Tale",
                notifDetails: "Detalii despre Notificare",
                dellAllHeader: "Ștergeți toate reamintirile?",
            },
            cardFields: {
                type: "Tip",
                month: "Lună",
                day: "Zi",
                hour: "Oră",
                minute: "Minut",
                weekDay: "Ziua Săptămânii",
                date: "Dată",
                time: "Oră",
            },
            buttons: {
                delAllBtn: "Șterge toate reamintirile"
            },
            misc: {
                emptyNotifs: "Nu există reamintiri programate"
            },
        },

        dashboard: {
            reminders: "Reamintiri",
            create: "Creează",
            profile: "Profil",
            settings: "Setări",
        },
        login: {
            pageHeader: "Conectați-vă la contul dvs.",
            email: "Email",
            passwd: "Parolă",
            forgotLink: "Ați uitat parola?",
            loginBtn: "Conectare",
            registerLink: "Nu aveți un cont? Înregistrați-vă!",
        },
        register: {
            pageHeader: "Înregistrați un cont nou",
            email: "Email",
            passwd: "Parolă",
            registerBtn: "Înregistrare",
            loginLink: "Nu aveți un cont? Înregistrați-vă!",
        },

    }
}

export default ro;