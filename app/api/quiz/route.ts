import Quiz from "@/models/Quiz";
import connectToDb from "@/utils/connectToDb"

export const POST = async (request: Request) => {

    await connectToDb();

    try {

        const { creator, title, description, questions } = await request.json();

        const newQuiz = new Quiz({
            creator,
            title,
            description,
            questions
        });

        newQuiz.save();

        return Response.json(
            {
                success: true,
                message: 'Quiz created successfully'
            },
            { status: 201 }
        )

    } catch (error) {
        return Response.json(
            {
                success: false,
                message: 'Quiz could not be saved'
            },
            { status: 500 }
        )
    }
}

export const GET = async () => {

    await connectToDb();

    try {

        const allQuizes = await Quiz.find({}).populate('creator');

        return Response.json(
            {
                success: true,
                data: allQuizes
            },
            { status: 200 }
        );

    } catch (error) {
        return Response.json(
            {
                success: false,
                message: 'Quizes could not be fetched'
            },
            { status: 500 }
        );
    }
}