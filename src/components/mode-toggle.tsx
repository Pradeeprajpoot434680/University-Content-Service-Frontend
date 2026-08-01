import React from "react"
import { Moon, Sun } from "lucide-react"
import { Switch } from "./ui/switch"
import { useTheme } from "../components/theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = theme === "dark"

  return (
    <div className="flex items-center gap-2">
   <Sun
      className="h-4 w-4 text-yellow-400 cursor-pointer"
      onClick={() => setTheme("light")}
    />

      <Switch
        checked={isDark}
        onCheckedChange={(checked) =>
          setTheme(checked ? "dark" : "light")
        }
        className="data-[state=checked]:bg-green-300"
      />


    <Moon
      className="h-4 w-4 text-blue-400 cursor-pointer"
      onClick={() => setTheme("dark")}
    />
    </div>
  )
}