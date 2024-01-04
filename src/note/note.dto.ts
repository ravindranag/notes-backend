import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateNoteDto {
	@IsString()
	@IsOptional()
	title?: string

	@IsString()
	@IsOptional()
	content?: string
}

export class CreateNoteDto {
	@IsString()
	@IsNotEmpty()
	title: string

	@IsString()
	@IsNotEmpty()
	content: string
}