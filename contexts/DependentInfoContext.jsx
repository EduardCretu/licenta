// imports related to context creation
import { createContext, useContext, useState } from 'react'
// importing DB related objects
import { tablesDB, DB_ID, DEP_TABLE_ID } from '../lib/appwrite'
import { Query } from 'react-native-appwrite'

// creating the context
export const DependentInfoContext = createContext()

// exporting the Provider
export function DependentInfoProvider({ children }) {
    // state consts to store Dependent data objects
    const [depInfo, setDepInfo] = useState([])


    // function to create dependent row
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
    // function to update dependent row
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
    // function to fetch dependent row by row ID, which row.$id === user.$id
    async function fetchDepInfoById(ID) {
        try {
            const response = await tablesDB.getRow({
              databaseId: DB_ID,
              tableId: DEP_TABLE_ID,
              rowId: ID,
            });

        setDepInfo(response);
        // return reponse promise or null for createRow() function
        return response
        } catch (err) {
        throw new Error(err.message);
        }
    }
    // function to ensure that there is always only one (1) row for each user.
    async function ensureDepInfo(ID) {
        try {
            // fetches the data of the row with row.$id === ID
            const existing = await fetchDepInfoById(ID)
            // if it exists return
            if (existing) {
                return existing
            }
            // if not, create row Dep row
            const created = await createDepInfo(ID)

            setDepInfo(created)
            return created
        }
        catch (err) {
            throw new Error(err.message)
        }
    }
    // function to delete Dep Table row. Used only when user deletes their account.
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

// custom hook to consume context
export const useDepInfo = () => useContext(DependentInfoContext)