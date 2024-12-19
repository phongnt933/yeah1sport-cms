export interface ITeam {
  id: string;
  name: string;
  description: string;
  type: string;
  captain: {
    id: string;
    name: string;
  };
  members: Array<{
    id: string;
    name: string;
    email: string;
  }>;
}
