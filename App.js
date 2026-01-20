import { StatusBar } from "expo-status-bar"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { SQLiteProvider } from "expo-sqlite"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import React, { useEffect } from "react"

import Home from "./src/screens/Home"
import Note from "./src/screens/Note"
import { Colors } from "./src/constants/styles"
import { DB_NAME, NoteBookProvider } from "./src/context/NotesContext"
import { resetDatabase } from "./src/utils/databaseHelper"

const Stack = createNativeStackNavigator()

SplashScreen.preventAutoHideAsync()

export default function App() {
  const [loaded, error] = useFonts({
    "Inter-Regular": require("./assets/fonts/Inter-Regular.ttf"),
    "Inter-Bold": require("./assets/fonts/Inter-Bold.ttf"),
    "GoogleSans-Regular": require("./assets/fonts/GoogleSans-Regular.ttf"),
    "GoogleSans-Bold": require("./assets/fonts/GoogleSans-SemiBold.ttf"),
    "GoogleSans_17pt-Regular": require("./assets/fonts/GoogleSans_17pt-Regular.ttf"),
    "GoogleSans_17pt-Bold": require("./assets/fonts/GoogleSans_17pt-SemiBold.ttf")
  })

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().catch((err) =>
        console.error("Failed to hide splash screen:", err)
      )

      if (error) {
        console.error("Error loading fonts:", error)
      }
    }
  }, [loaded, error])

  if (!loaded && !error) {
    return null
  }

  return (
    <React.Fragment>
      <SQLiteProvider
        databaseName={DB_NAME}
        onInit={async (db) => {
          try {


            // For development: Uncomment the next line to reset database
            // await resetDatabase(db)

            // Create notebook table with migration support
            await db.execAsync(`
            CREATE TABLE IF NOT EXISTS notebook (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              title TEXT NOT NULL,
              content TEXT NOT NULL,
              date TEXT NOT NULL,
              isPrivate INTEGER NOT NULL DEFAULT 0
            );
            `)

            // Check if isChecklist column exists, if not add it
            try {
              await db.execAsync("SELECT isChecklist FROM notebook LIMIT 1")
            } catch (error) {
              // Column doesn't exist, add it
              await db.execAsync("ALTER TABLE notebook ADD COLUMN isChecklist INTEGER NOT NULL DEFAULT 0")
            }

            // Check if color column exists, if not add it
            try {
              await db.execAsync("SELECT color FROM notebook LIMIT 1")
            } catch (error) {
              await db.execAsync("ALTER TABLE notebook ADD COLUMN color TEXT")
            }

            // Create checklist_items table
            await db.execAsync(`
            CREATE TABLE IF NOT EXISTS checklist_items (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              note_id INTEGER NOT NULL,
              title TEXT NOT NULL,
              isCompleted INTEGER NOT NULL DEFAULT 0,
              order_index INTEGER NOT NULL DEFAULT 0,
              FOREIGN KEY (note_id) REFERENCES notebook (id) ON DELETE CASCADE
            );
            `)

            await db.execAsync("PRAGMA journal_mode=WAL")
          } catch (error) {
            console.log("ON_INIT ERR: ", error)
          }
        }}
        options={{ useNewConnection: false }}
      >
        <NoteBookProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Colors.bg200 },
              }}
            >
              <Stack.Screen
                name="Home"
                component={Home}
              />
              <Stack.Screen
                name="Note"
                component={Note}
              />
            </Stack.Navigator>
            <StatusBar style="dark" />
          </NavigationContainer>
        </NoteBookProvider>
      </SQLiteProvider>
    </React.Fragment>
  )
}
