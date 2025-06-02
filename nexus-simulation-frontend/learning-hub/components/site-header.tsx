import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calculator, User, LogOut, Bell, Search, Code, Database, Users } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Calculator className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-xl">Nexus</span>
          </Link>

          <nav className="hidden md:flex gap-6">
            <Link href="/models" className="text-sm font-medium transition-colors hover:text-blue-600">
              Models
            </Link>
            <Link href="/create" className="text-sm font-medium transition-colors hover:text-blue-600">
              Create
            </Link>
            <Link href="/datasets" className="text-sm font-medium transition-colors hover:text-blue-600">
              Datasets
            </Link>
            <Link href="/collaborate" className="text-sm font-medium transition-colors hover:text-blue-600">
              Collaborate
            </Link>
            <Link href="/docs" className="text-sm font-medium transition-colors hover:text-blue-600">
              Docs
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input type="search" placeholder="Search models..." className="w-[200px] lg:w-[300px] pl-8" />
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-600"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-gray-500">john.doe@university.edu</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Code className="mr-2 h-4 w-4" />
                <span>My Models</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Database className="mr-2 h-4 w-4" />
                <span>My Datasets</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                <span>Collaborations</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
