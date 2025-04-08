import type { Role } from '@/types/common'

export type Session = {
	state: string
	authToken: string
	user: {
		id: string
		role: Role
	}
}