from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task

@CrewBase
class ReviewSpecialists:
    """ReviewSpecialists crew"""

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    # --- Agents ---
    @agent
    def analytical_critic(self) -> Agent:
        return Agent(config=self.agents_config["analytical_critic"], verbose=True)

    @agent
    def emotional_critic(self) -> Agent:
        return Agent(config=self.agents_config["emotional_critic"], verbose=True)

    @agent
    def experimental_critic(self) -> Agent:
        return Agent(config=self.agents_config["experimental_critic"], verbose=True)

    @agent
    def classical_critic(self) -> Agent:
        return Agent(config=self.agents_config["classical_critic"], verbose=True)

    @agent
    def provocative_critic(self) -> Agent:
        return Agent(config=self.agents_config["provocative_critic"], verbose=True)

    @agent
    def music_specialist(self) -> Agent:
        return Agent(config=self.agents_config["music_specialist"], verbose=True)

    @agent
    def cinema_specialist(self) -> Agent:
        return Agent(config=self.agents_config["cinema_specialist"], verbose=True)

    @agent
    def literature_specialist(self) -> Agent:
        return Agent(config=self.agents_config["literature_specialist"], verbose=True)

    @agent
    def cultural_historian(self) -> Agent:
        return Agent(config=self.agents_config["cultural_historian"], verbose=True)

    @agent
    def social_context_analyst(self) -> Agent:
        return Agent(config=self.agents_config["social_context_analyst"], verbose=True)

    @agent
    def comparator_agent(self) -> Agent:
        return Agent(config=self.agents_config["comparator_agent"], verbose=True)

    @agent
    def critic_writer(self) -> Agent:
        return Agent(config=self.agents_config["critic_writer"], verbose=True)

    @agent
    def editor_agent(self) -> Agent:
        return Agent(config=self.agents_config["editor_agent"], verbose=True)

    @agent
    def curator_agent(self) -> Agent:
        return Agent(config=self.agents_config["curator_agent"], verbose=True)

    @agent
    def meta_critic(self) -> Agent:
        return Agent(config=self.agents_config["meta_critic"], verbose=True)


    # --- Tasks ---
    @task
    def theme_intake_task(self) -> Task:
        return Task(config=self.tasks_config["theme_intake_task"])

    @task
    def analytical_critique_task(self) -> Task:
        return Task(config=self.tasks_config["analytical_critique_task"])

    @task
    def emotional_critique_task(self) -> Task:
        return Task(config=self.tasks_config["emotional_critique_task"])

    @task
    def experimental_critique_task(self) -> Task:
        return Task(config=self.tasks_config["experimental_critique_task"])

    @task
    def classical_critique_task(self) -> Task:
        return Task(config=self.tasks_config["classical_critique_task"])

    @task
    def provocative_critique_task(self) -> Task:
        return Task(config=self.tasks_config["provocative_critique_task"])

    @task
    def music_specialist_task(self) -> Task:
        return Task(config=self.tasks_config["music_specialist_task"])

    @task
    def cinema_specialist_task(self) -> Task:
        return Task(config=self.tasks_config["cinema_specialist_task"])

    @task
    def literature_specialist_task(self) -> Task:
        return Task(config=self.tasks_config["literature_specialist_task"])

    @task
    def social_context_task(self) -> Task:
        return Task(config=self.tasks_config["social_context_task"])

    @task
    def comparative_analysis_task(self) -> Task:
        return Task(config=self.tasks_config["comparative_analysis_task"])

    @task
    def cross_critique_task(self) -> Task:
        return Task(config=self.tasks_config["cross_critique_task"])

    @task
    def synthesis_writing_task(self) -> Task:
        return Task(config=self.tasks_config["synthesis_writing_task"])

    @task
    def final_scoring_task(self) -> Task:
        return Task(config=self.tasks_config["final_scoring_task"])

    @crew
    def review_specialists_crew(self) -> Crew:
        return Crew(
            name="Review Specialists Crew",
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
        )
