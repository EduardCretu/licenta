// imports related to context creation
import { createContext, useContext, useState, useEffect } from 'react'

// importing DB related objects
import { tablesDB, DB_ID, TABLE_ID } from '../lib/appwrite'
import { ID, Query } from 'react-native-appwrite'

// creating the context
export const MedInfoContext = createContext()

// exporting the Provider
export function MedInfoProvider({ children }) {
    // state const to store our data object
    const [medInfo, setMedInfo] = useState([]);

    // function to update user row
    async function updateMedInfo(ID, extern_data) {
        try {
            await tablesDB.updateRow({
                databaseId: DB_ID,
                tableId: TABLE_ID,
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
    async function fetchMedInfoById(ID) {
          try {
                const response = await tablesDB.listRows({
                  databaseId: DB_ID,
                  tableId: TABLE_ID,
                  queries: [Query.equal('$id', ID)],
                });

            setMedInfo(response);
            // return reponse promise or null for createRow() function
            return response.rows[0] ?? null
          } catch (err) {
            throw new Error(err.message);
         }
    }
    // function to create user row
    async function createMedInfo(ID) {
        try {
            await tablesDB.createRow({
                databaseId: DB_ID,
                tableId: TABLE_ID,
                rowId: ID,
                data: {
                    FullName: null,
                    //DOB: null,
                    Address: null,
                    BloodType: null,
                    GeneticCond: null,
                    ChronicIll: null,
                    Allergies: null,
                    Medications: null,
                    //RecentScreenDate: null,
                    RecentScreenInfo: null,
                }
            })
        }
        catch (err) {
            throw Error (err.message)
        }
    }
    // intermediary function tied to fetch and create.
    // function creates a user row only the user row with user.$id === row.$id cannot be found by fetch
    // ergo make a row if user has no row
    async function ensureMedInfo(ID) {
          try {
              const existing = await fetchMedInfoById(ID)

              if (existing) {
                  return existing
              }

              const created = await createMedInfo(ID)
              setMedInfo(created)

              return created
          }
          catch (err) {
              throw new Error(err.message)
          }
    }

    // function to delete user row, only called when user deletes account
    async function deleteMedInfo(ID) {
        try {
            await tablesDB.deleteRow({
                databaseId: DB_ID,
                tableId: TABLE_ID,
                rowId: ID,
            })
        }
        catch (err) {
            throw Error (err.message)
        }
    }

    return (
        <MedInfoContext.Provider value={{medInfo, updateMedInfo, fetchMedInfoById, createMedInfo, deleteMedInfo, ensureMedInfo}}>
            {children}
        </MedInfoContext.Provider>
    )
}

export const useMedInfo = () => useContext(MedInfoContext)

