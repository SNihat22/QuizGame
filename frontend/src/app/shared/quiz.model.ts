export interface IQuestion {
  _id: string;
  question: string,
  options: string[],
  answer: string
}
export interface IQuiz {
  _id: string;
  title: string;
  description: string;
  questions: IQuestion[]
}
