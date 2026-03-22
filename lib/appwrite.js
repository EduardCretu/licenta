import { Client, Account, Avatars } from "react-native-appwrite";

export const client = new Client()
    .setProject('695a6dd30025f5326127')
    .setPlatform('ReactNative')
    .setEndpoint('https://fra.cloud.appwrite.io/v1');

export const account = new Account(client)

export const avatars = new Avatars(client)
