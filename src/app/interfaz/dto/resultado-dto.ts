import { Column } from './column';

export class ResultadoDto {

     public parentColumnNames: string[] = [];
	public childColumnNames: Column[] = [];
     public valores: any[] = [];
}