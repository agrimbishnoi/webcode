interface QuestionData {
    acRate: number | string;
    difficulty: string;
    freqBar: number | string | null;
    frontendQuestionId: string;
    isFavor: boolean | string;
    paidOnly: boolean | string;
    status: string | null;
    title: string;
    titleSlug: string;
    topicTags: { name: string; id: string; slug: string }[] | string;
    hasSolution: boolean | string;
    hasVideoSolution: boolean | string;
}



export async function getQuestionData(problemName: string): Promise<QuestionData> {
    try {
      const response = await fetch('/api/question-data');
      
      if (!response.ok) {
        throw new Error('Failed to fetch question data');
      }

      console.log("found the file");
      const jsonData = await response.json();
      const questions = jsonData?.data?.problemsetQuestionList?.questions || [];

      console.log(problemName);
      
      const question = questions.find((q: any) => 
          q.frontendQuestionId.toLowerCase().trim() === problemName.toLowerCase().trim()
      );
      
      if (question) {
          console.log("Found question:", question);
      } else {
          console.log("Question not found");
      }
      
      return question || {
        acRate: "Not Found",
        difficulty: "Not Found",
        freqBar: "Not Found",
        frontendQuestionId: problemName,
        isFavor: "Not Found",
        paidOnly: "Not Found",
        status: "Not Found",
        title: "Not found",
        titleSlug: "Not Found",
        topicTags: "Not Found",
        hasSolution: "Not Found",
        hasVideoSolution: "Not Found"
      };
    } catch (error) {
      console.error('Error fetching question data:', error);
      return {
        acRate: "Not Found",
        difficulty: "Not Found",
        freqBar: "Not Found",
        frontendQuestionId: problemName,
        isFavor: "Not Found",
        paidOnly: "Not Found",
        status: "Not Found",
        title: "Not found",
        titleSlug: "Not Found",
        topicTags: "Not Found",
        hasSolution: "Not Found",
        hasVideoSolution: "Not Found"
      };
    }
  }