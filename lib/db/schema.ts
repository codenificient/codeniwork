import { relations } from 'drizzle-orm'
import { boolean,index,pgEnum,pgTable,text,timestamp,uuid } from 'drizzle-orm/pg-core'

// Enums
export const applicationStatusEnum=pgEnum( 'application_status',[
	'applied',
	'screening',
	'interview',
	'offer',
	'rejected',
	'withdrawn'
] )

export const priorityEnum=pgEnum( 'priority',[
	'low',
	'medium',
	'high'
] )

// Users table
export const users=pgTable( 'users',{
	id: uuid( 'id' ).primaryKey().defaultRandom(),
	email: text( 'email' ).notNull().unique(),
	name: text( 'name' ),
	image: text( 'image' ),
	emailVerified: timestamp( 'email_verified',{ mode: 'date' } ),
	passwordHash: text( 'password_hash' ),
	createdAt: timestamp( 'created_at' ).defaultNow().notNull(),
	updatedAt: timestamp( 'updated_at' ).defaultNow().notNull(),
} )

// Companies table
export const companies=pgTable( 'companies',{
	id: uuid( 'id' ).primaryKey().defaultRandom(),
	name: text( 'name' ).notNull(),
	website: text( 'website' ),
	logo: text( 'logo' ),
	description: text( 'description' ),
	location: text( 'location' ),
	industry: text( 'industry' ),
	size: text( 'size' ),
	createdAt: timestamp( 'created_at' ).defaultNow().notNull(),
	updatedAt: timestamp( 'updated_at' ).defaultNow().notNull(),
} )

// Job applications table
export const jobApplications=pgTable( 'job_applications',{
	id: uuid( 'id' ).primaryKey().defaultRandom(),
	userId: uuid( 'user_id' ).references( () => users.id,{ onDelete: 'cascade' } ).notNull(),
	companyId: uuid( 'company_id' ).references( () => companies.id,{ onDelete: 'cascade' } ).notNull(),
	position: text( 'position' ).notNull(),
	status: applicationStatusEnum( 'status' ).default( 'applied' ).notNull(),
	priority: priorityEnum( 'priority' ).default( 'medium' ),
	salary: text( 'salary' ),
	location: text( 'location' ),
	jobUrl: text( 'job_url' ),
	notes: text( 'notes' ),
	appliedAt: timestamp( 'applied_at' ).defaultNow().notNull(),
	deadline: timestamp( 'deadline' ),
	isRemote: boolean( 'is_remote' ).default( false ),
	createdAt: timestamp( 'created_at' ).defaultNow().notNull(),
	updatedAt: timestamp( 'updated_at' ).defaultNow().notNull(),
} )

// Application events table (for tracking progress)
export const applicationEvents=pgTable( 'application_events',{
	id: uuid( 'id' ).primaryKey().defaultRandom(),
	applicationId: uuid( 'application_id' ).references( () => jobApplications.id,{ onDelete: 'cascade' } ).notNull(),
	type: text( 'type' ).notNull(), // 'email', 'call', 'interview', 'offer', etc.
	title: text( 'title' ).notNull(),
	description: text( 'description' ),
	date: timestamp( 'date' ).notNull(),
	createdAt: timestamp( 'created_at' ).defaultNow().notNull(),
} )

// Documents table
export const documents=pgTable( 'documents',{
	id: uuid( 'id' ).primaryKey().defaultRandom(),
	userId: uuid( 'user_id' ).references( () => users.id,{ onDelete: 'cascade' } ).notNull(),
	name: text( 'name' ).notNull(),
	type: text( 'type' ).notNull(), // 'resume', 'cover_letter', 'portfolio', 'other'
	format: text( 'format' ).notNull(), // 'PDF', 'DOCX', 'DOC', etc.
	size: text( 'size' ), // File size in KB/MB
	fileUrl: text( 'file_url' ).notNull(), // Cloudinary URL
	publicId: text( 'public_id' ), // Cloudinary public ID for deletion
	description: text( 'description' ),
	status: text( 'status' ).default( 'active' ).notNull(), // 'active', 'archived', 'template'
	version: text( 'version' ).default( 'v1.0' ),
	createdAt: timestamp( 'created_at' ).defaultNow().notNull(),
	updatedAt: timestamp( 'updated_at' ).defaultNow().notNull(),
} )

// Relations
export const usersRelations=relations( users,( { many } ) => ( {
	applications: many( jobApplications ),
	documents: many( documents ),
} ) )

export const companiesRelations=relations( companies,( { many } ) => ( {
	applications: many( jobApplications ),
} ) )

export const jobApplicationsRelations=relations( jobApplications,( { one,many } ) => ( {
	user: one( users,{
		fields: [ jobApplications.userId ],
		references: [ users.id ],
	} ),
	company: one( companies,{
		fields: [ jobApplications.companyId ],
		references: [ companies.id ],
	} ),
	events: many( applicationEvents ),
} ) )

export const applicationEventsRelations=relations( applicationEvents,( { one } ) => ( {
	application: one( jobApplications,{
		fields: [ applicationEvents.applicationId ],
		references: [ jobApplications.id ],
	} ),
} ) )

// Auth tables for NextAuth.js
export const sessions=pgTable( 'sessions',{
	sessionToken: text( 'session_token' ).primaryKey(),
	userId: uuid( 'user_id' ).references( () => users.id,{ onDelete: 'cascade' } ).notNull(),
	expires: timestamp( 'expires',{ mode: 'date' } ).notNull(),
} )

export const accounts=pgTable( 'accounts',{
	id: text( 'id' ).primaryKey(),
	userId: uuid( 'user_id' ).references( () => users.id,{ onDelete: 'cascade' } ).notNull(),
	type: text( 'type' ).notNull(),
	provider: text( 'provider' ).notNull(),
	providerAccountId: text( 'provider_account_id' ).notNull(),
	refresh_token: text( 'refresh_token' ),
	access_token: text( 'access_token' ),
	expires_at: text( 'expires_at' ),
	token_type: text( 'token_type' ),
	scope: text( 'scope' ),
	id_token: text( 'id_token' ),
	session_state: text( 'session_state' ),
} )

export const verificationTokens=pgTable( 'verification_tokens',{
	identifier: text( 'identifier' ).notNull(),
	token: text( 'token' ).notNull().unique(),
	expires: timestamp( 'expires',{ mode: 'date' } ).notNull(),
},( table ) => ( {
	identifierTokenIdx: index( 'identifier_token_idx' ).on( table.identifier,table.token ),
} ) )

// Auth relations
export const sessionsRelations=relations( sessions,( { one } ) => ( {
	user: one( users,{
		fields: [ sessions.userId ],
		references: [ users.id ],
	} ),
} ) )

export const accountsRelations=relations( accounts,( { one } ) => ( {
	user: one( users,{
		fields: [ accounts.userId ],
		references: [ users.id ],
	} ),
} ) )
