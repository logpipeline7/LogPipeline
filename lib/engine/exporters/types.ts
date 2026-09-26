export interface ExporterField {
  name: string;
  type: string;
  description?: string;
}

export interface ExporterInput {
  pattern: string;
  compiledRegex: string;
  fields: ExporterField[];
  pipelineName?: string;
}
