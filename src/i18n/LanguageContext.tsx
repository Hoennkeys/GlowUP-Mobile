import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type LanguageCode = 'pt' | 'en' | 'es' | 'de' | 'zh' | 'fr' | 'it';

export const LANGUAGES: { code: LanguageCode; label: string; flag: string }[] = [
  { code: 'pt', label: 'Português (BR)', flag: '🇧🇷' },
  { code: 'en', label: 'English (US)', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', label: '中文 (简体)', flag: '🇨🇳' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
];

export const translations = {
  pt: {
    home: 'Home',
    dashboard: 'Dashboard',
    campaigns: 'Campanhas',
    profile: 'Perfil',
    greeting: 'Olá',
    today_campaigns: 'Suas campanhas de hoje',
    featured: 'Em destaque',
    recent_campaigns: 'Campanhas recentes',
    edit_profile: 'Editar Perfil',
    edit_profile_desc: 'Nome, bio e foto',
    change_password: 'Alterar Senha',
    change_password_desc: 'Segurança da conta',
    notifications: 'Notificações',
    notifications_desc: 'Preferências de alerta',
    language: 'Idioma',
    logout: 'Sair da conta',
    logout_desc: 'Encerrar sessão atual',
    account: 'Conta',
    session: 'Sessão',
    back: 'Voltar',
    full_name: 'Nome completo',
    bio: 'Bio',
    save_changes: 'Salvar alterações',
    cancel: 'Cancelar',
    current_password: 'Senha atual',
    new_password: 'Nova senha',
    confirm_new_password: 'Confirmar nova senha',
    change_password_btn: 'Alterar senha',
    choose_language: 'Escolha o idioma',
    chats: 'Chats',
    send_message: 'Enviar mensagem',
    type_message: 'Digite uma mensagem',
    no_messages: 'Nenhuma mensagem ainda',
    search_chats: 'Buscar conversas...',
  },
  en: {
    home: 'Home',
    dashboard: 'Dashboard',
    campaigns: 'Campaigns',
    profile: 'Profile',
    greeting: 'Hello',
    today_campaigns: 'Your campaigns for today',
    featured: 'Featured',
    recent_campaigns: 'Recent campaigns',
    edit_profile: 'Edit Profile',
    edit_profile_desc: 'Name, bio and photo',
    change_password: 'Change Password',
    change_password_desc: 'Account security',
    notifications: 'Notifications',
    notifications_desc: 'Alert preferences',
    language: 'Language',
    logout: 'Log out',
    logout_desc: 'Log out of current session',
    account: 'Account',
    session: 'Session',
    back: 'Back',
    full_name: 'Full name',
    bio: 'Bio',
    save_changes: 'Save changes',
    cancel: 'Cancel',
    current_password: 'Current password',
    new_password: 'New password',
    confirm_new_password: 'Confirm new password',
    change_password_btn: 'Change password',
    choose_language: 'Choose language',
    chats: 'Chats',
    send_message: 'Send message',
    type_message: 'Type a message',
    no_messages: 'No messages yet',
    search_chats: 'Search chats...',
  },
  es: {
    home: 'Inicio',
    dashboard: 'Tablero',
    campaigns: 'Campañas',
    profile: 'Perfil',
    greeting: 'Hola',
    today_campaigns: 'Tus campañas de hoy',
    featured: 'Destacados',
    recent_campaigns: 'Campañas recientes',
    edit_profile: 'Editar Perfil',
    edit_profile_desc: 'Nombre, biografía y foto',
    change_password: 'Cambiar Contraseña',
    change_password_desc: 'Seguridad de la cuenta',
    notifications: 'Notificaciones',
    notifications_desc: 'Preferencias de alerta',
    language: 'Idioma',
    logout: 'Cerrar sesión',
    logout_desc: 'Cerrar sesión actual',
    account: 'Cuenta',
    session: 'Sesión',
    back: 'Atrás',
    full_name: 'Nombre completo',
    bio: 'Biografía',
    save_changes: 'Guardar cambios',
    cancel: 'Cancelar',
    current_password: 'Contraseña actual',
    new_password: 'Nueva contraseña',
    confirm_new_password: 'Confirmar nueva contraseña',
    change_password_btn: 'Cambiar contraseña',
    choose_language: 'Elige el idioma',
    chats: 'Chats',
    send_message: 'Enviar mensaje',
    type_message: 'Escribe un mensagem',
    no_messages: 'Aún no hay mensajes',
    search_chats: 'Buscar chats...',
  },
  de: {
    home: 'Startseite',
    dashboard: 'Dashboard',
    campaigns: 'Kampagnen',
    profile: 'Profil',
    greeting: 'Hallo',
    today_campaigns: 'Ihre heutigen Kampagnen',
    featured: 'Hervorgehoben',
    recent_campaigns: 'Letzte Kampagnen',
    edit_profile: 'Profil bearbeiten',
    edit_profile_desc: 'Name, Biografie und Foto',
    change_password: 'Passwort ändern',
    change_password_desc: 'Kontosicherheit',
    notifications: 'Benachrichtigungen',
    notifications_desc: 'Benachrichtigungseinstellungen',
    language: 'Sprache',
    logout: 'Abmelden',
    logout_desc: 'Aktuelle Sitzung beenden',
    account: 'Konto',
    session: 'Sitzung',
    back: 'Zurück',
    full_name: 'Vollständiger Name',
    bio: 'Biografie',
    save_changes: 'Änderungen speichern',
    cancel: 'Abbrechen',
    current_password: 'Aktuelles Passwort',
    new_password: 'Neues Passwort',
    confirm_new_password: 'Neues Passwort bestätigen',
    change_password_btn: 'Passwort ändern',
    choose_language: 'Sprache wählen',
  },
  zh: {
    home: '首页',
    dashboard: '仪表板',
    campaigns: '活动',
    profile: '个人资料',
    greeting: '你好',
    today_campaigns: '你今天的活动',
    featured: '精选活动',
    recent_campaigns: '最近的活动',
    edit_profile: '编辑个人资料',
    edit_profile_desc: '姓名、个人简介和照片',
    change_password: '修改密码',
    change_password_desc: '账户安全',
    notifications: '通知设置',
    notifications_desc: '警报首选项',
    language: '语言设置',
    logout: '退出登录',
    logout_desc: '退出当前会话',
    account: '账户',
    session: '会话',
    back: '返回',
    full_name: '全名',
    bio: '个人简介',
    save_changes: '保存更改',
    cancel: '取消',
    current_password: '当前密码',
    new_password: '新密码',
    confirm_new_password: '确认新密码',
    change_password_btn: '修改密码',
    choose_language: '选择语言',
  },
  fr: {
    home: 'Accueil',
    dashboard: 'Tableau de bord',
    campaigns: 'Campagnes',
    profile: 'Profil',
    greeting: 'Bonjour',
    today_campaigns: 'Vos campagnes du jour',
    featured: 'En vedette',
    recent_campaigns: 'Campagnes récentes',
    edit_profile: 'Modifier le profil',
    edit_profile_desc: 'Nom, biographie et photo',
    change_password: 'Changer le mot de passe',
    change_password_desc: 'Sécurité du compte',
    notifications: 'Notifications',
    notifications_desc: 'Préférences d\'alerte',
    language: 'Langue',
    logout: 'Se déconnecter',
    logout_desc: 'Quitter la session en cours',
    account: 'Compte',
    session: 'Session',
    back: 'Retour',
    full_name: 'Nom complet',
    bio: 'Biographie',
    save_changes: 'Enregistrer les modifications',
    cancel: 'Annuler',
    current_password: 'Mot de passe actuel',
    new_password: 'Nouveau mot de passe',
    confirm_new_password: 'Confirmer le nouveau mot de passe',
    change_password_btn: 'Changer le mot de passe',
    choose_language: 'Choisir la langue',
  },
  it: {
    home: 'Home',
    dashboard: 'Bacheca',
    campaigns: 'Campagne',
    profile: 'Profilo',
    greeting: 'Ciao',
    today_campaigns: 'Le tue campagne di oggi',
    featured: 'In evidenza',
    recent_campaigns: 'Campagne recenti',
    edit_profile: 'Modifica Profilo',
    edit_profile_desc: 'Nome, biografia e foto',
    change_password: 'Cambia Password',
    change_password_desc: 'Sicurezza dell\'account',
    notifications: 'Notifiche',
    notifications_desc: 'Preferenze avvisi',
    language: 'Lingua',
    logout: 'Disconnetti',
    logout_desc: 'Termina la sessione corrente',
    account: 'Account',
    session: 'Sessione',
    back: 'Indietro',
    full_name: 'Nome completo',
    bio: 'Biografia',
    save_changes: 'Salva modifiche',
    cancel: 'Annulla',
    current_password: 'Password attuale',
    new_password: 'Nuova password',
    confirm_new_password: 'Conferma nuova password',
    change_password_btn: 'Cambia password',
    choose_language: 'Scegli la lingua',
  },
};

interface LanguageContextValue {
  language: LanguageCode;
  changeLanguage: (code: LanguageCode) => Promise<void>;
  t: (key: keyof typeof translations['pt']) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'pt',
  changeLanguage: async () => {},
  t: (key) => translations.pt[key] || key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('pt');

  useEffect(() => {
    AsyncStorage.getItem('app_language').then((savedLanguage) => {
      if (savedLanguage) {
        setLanguageState(savedLanguage as LanguageCode);
      }
    });
  }, []);

  const changeLanguage = async (code: LanguageCode) => {
    setLanguageState(code);
    await AsyncStorage.setItem('app_language', code);
  };

  const t = (key: keyof typeof translations['pt']) => {
    const dict = translations[language] || translations.pt;
    return (dict as any)[key] || (translations.pt as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
