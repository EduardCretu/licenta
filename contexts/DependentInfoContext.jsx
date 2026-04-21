// imports related to context creation
import { createContext, useContext, useState } from 'react'
// importing DB related objects
import { tablesDB, DB_ID, DEP_TABLE_ID } from '../lib/appwrite'
import { Query } from 'react-native-appwrite'

export const DependentInfoContext = createContext()

export function DependentInfoProvider({ children }) {
    const [depInfo, setDepInfo] = useState([])



    async function createDepInfo(ID) {
        try {
            await tablesDB.createRow({
                databaseId: DB_ID,
                tableId: DEP_TABLE_ID,
                rowId: ID,
                data: {
                    DependentIdArr: null,
                }
            })
        }
        catch (err) {
            throw Error (err.message)
        }
    }

    async function updateDepInfo(ID, extern_data) {
        try {
            await tablesDB.updateRow({
                databaseId: DB_ID,
                tableId: DEP_TABLE_ID,
                rowId: ID,
                data: {
                    ...extern_data
                }
            })
        }
        catch (err) {
            throw Error (err.message)
        }
    }

    // function to fetch user row by row ID, which row.$id === user.$id
    async function fetchDepInfoById(ID) {
        try {
            const response = await tablesDB.listRows({
              databaseId: DB_ID,
              tableId: DEP_TABLE_ID,
              queries: [Query.equal('$id', ID)],
            });

        setDepInfo(response);
        // return reponse promise or null for createRow() function
        return response.rows[0] ?? null
        } catch (err) {
        throw new Error(err.message);
        }
    }
    async function ensureDepInfo(ID) {
        try {
            console.log('before fetch')
            const existing = await fetchDepInfoById(ID)
            console.log('after fetch')
            if (existing) {
                //console.log('exitst')
                return existing
            }
            console.log('creating')
            const created = await createDepInfo(ID)
            setDepInfo(created)

            return created
        }
        catch (err) {
            throw new Error(err.message)
        }
    }
    async function deleteDepInfo(ID) {
        try {
            await tablesDB.deleteRow({
                databaseId: DB_ID,
                tableId: DEP_TABLE_ID,
                rowId: ID,
            })
        }
        catch (err) {
            throw Error (err.message)
        }
    }

    return(
        <DependentInfoContext.Provider value={{
            depInfo,
            createDepInfo,
            updateDepInfo,
            fetchDepInfoById,
            deleteDepInfo,
            ensureDepInfo
        }}>
            { children }
        </DependentInfoContext.Provider>
    )
}

export const useDepInfo = () => useContext(DependentInfoContext)