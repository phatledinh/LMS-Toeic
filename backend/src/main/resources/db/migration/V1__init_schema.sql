
    create table answer_options (
        is_correct bit,
        id bigint not null auto_increment,
        question_id bigint,
        content TEXT,
        label varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table exams (
        duration_minutes integer,
        total_questions integer,
        year integer,
        created_at datetime(6),
        id bigint not null auto_increment,
        updated_at datetime(6),
        description varchar(255),
        title varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table exercise_question_groups (
        order_index integer,
        created_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6),
        exercise_id bigint,
        id bigint not null auto_increment,
        source_topic_id bigint,
        updated_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        audio_url varchar(255),
        image_url varchar(255),
        passage TEXT,
        primary key (id)
    ) engine=InnoDB;

    create table exercise_questions (
        question_number integer,
        created_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6),
        exercise_id bigint,
        group_id bigint,
        id bigint not null auto_increment,
        source_topic_id bigint,
        updated_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        content TEXT,
        correct_answer CHAR(1),
        explanation TEXT,
        option_a varchar(255),
        option_b varchar(255),
        option_c varchar(255),
        option_d varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table exercises (
        is_active bit,
        order_index integer,
        total_questions integer,
        created_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6),
        id bigint not null auto_increment,
        topic_id bigint,
        updated_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        exercise_type enum ('GRAMMAR','LISTENING_PART1','LISTENING_PART2','LISTENING_PART3','LISTENING_PART4','READING_PART5','READING_PART6','READING_PART7'),
        primary key (id)
    ) engine=InnoDB;

    create table group_content_blocks (
        order_index integer,
        created_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6),
        group_id bigint,
        id bigint not null auto_increment,
        updated_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        content TEXT,
        image_url varchar(255),
        block_type enum ('IMAGE','TEXT'),
        primary key (id)
    ) engine=InnoDB;

    create table group_topic_tags (
        created_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6),
        group_id bigint,
        id bigint not null auto_increment,
        topic_id bigint,
        updated_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        tag_type enum ('CONVERSATION_THEME','FORMAT','GRAMMAR','QUESTION_TYPE','STRUCTURE','VOCABULARY'),
        primary key (id)
    ) engine=InnoDB;

    create table lessons (
        duration_minutes integer,
        is_active bit,
        order_index integer,
        created_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6),
        id bigint not null auto_increment,
        topic_id bigint,
        updated_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        slug varchar(255),
        title varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table mock_test_answers (
        is_correct bit,
        attempt_id bigint,
        created_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6),
        id bigint not null auto_increment,
        question_id bigint,
        selected_option_id bigint,
        updated_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        primary key (id)
    ) engine=InnoDB;

    create table mock_test_attempts (
        listening_score integer,
        reading_score integer,
        total_score integer,
        created_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6),
        end_time datetime(6),
        id bigint not null auto_increment,
        mock_test_id bigint,
        start_time datetime(6),
        updated_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        user_id bigint,
        status enum ('IN_PROGRESS','SUBMITTED','TIMEOUT'),
        primary key (id)
    ) engine=InnoDB;

    create table mock_tests (
        duration_minutes integer,
        is_active bit,
        passing_score integer,
        total_score integer,
        created_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6),
        exam_id bigint,
        id bigint not null auto_increment,
        updated_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        title varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table parts (
        part_number integer,
        exam_id bigint,
        id bigint not null auto_increment,
        audio_url varchar(255),
        description varchar(255),
        title varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table permissions (
        created_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6),
        id bigint not null auto_increment,
        updated_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        api_path varchar(255),
        description varchar(255),
        method varchar(255),
        module varchar(255),
        name varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table practice_question_stats (
        correct_count integer not null,
        weight float(53) not null,
        wrong_count integer not null,
        created_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6),
        id bigint not null auto_increment,
        last_answered_at datetime(6),
        question_id bigint not null,
        updated_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        user_id bigint not null,
        primary key (id)
    ) engine=InnoDB;

    create table practice_sessions (
        correct_count integer not null,
        total_questions integer not null,
        wrong_count integer not null,
        created_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6),
        ended_at datetime(6),
        id bigint not null auto_increment,
        section_id bigint not null,
        started_at datetime(6) not null,
        topic_id bigint,
        updated_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        user_id bigint not null,
        primary key (id)
    ) engine=InnoDB;

    create table question_groups (
        id bigint not null auto_increment,
        part_id bigint,
        audio_url varchar(255),
        image_url varchar(255),
        passage_text TEXT,
        primary key (id)
    ) engine=InnoDB;

    create table question_topic_tags (
        created_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6),
        id bigint not null auto_increment,
        question_id bigint,
        topic_id bigint,
        updated_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        tag_type enum ('CONVERSATION_THEME','FORMAT','GRAMMAR','QUESTION_TYPE','STRUCTURE','VOCABULARY'),
        primary key (id)
    ) engine=InnoDB;

    create table questions (
        question_number integer,
        id bigint not null auto_increment,
        question_group_id bigint,
        ai_explanation TEXT,
        audio_url varchar(255),
        content TEXT,
        image_url varchar(255),
        transcript TEXT,
        primary key (id)
    ) engine=InnoDB;

    create table refresh_tokens (
        revoked bit not null,
        created_at datetime(6),
        expires_at datetime(6) not null,
        id bigint not null auto_increment,
        user_id bigint not null,
        ip_address varchar(45),
        token varchar(512) not null,
        device_info varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table role_permission (
        permission_id bigint not null,
        role_id bigint not null
    ) engine=InnoDB;

    create table roles (
        created_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6),
        id bigint not null auto_increment,
        updated_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        description varchar(255),
        name varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table sections (
        is_active bit,
        order_index integer,
        created_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6),
        id bigint not null auto_increment,
        updated_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        description varchar(255),
        slug varchar(255),
        title varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table topics (
        is_active bit,
        order_index integer,
        created_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6),
        id bigint not null auto_increment,
        section_id bigint,
        updated_at datetime(6) not null DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        description varchar(255),
        slug varchar(255),
        title varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table user_exercise_results (
        score integer,
        total_questions integer,
        completed_at datetime(6),
        exercise_id bigint,
        id bigint not null auto_increment,
        user_id bigint,
        user_answers JSON,
        primary key (id)
    ) engine=InnoDB;

    create table user_lesson_progress (
        is_completed bit,
        completed_at datetime(6),
        created_at datetime(6),
        id bigint not null auto_increment,
        lesson_id bigint,
        user_id bigint,
        primary key (id)
    ) engine=InnoDB;

    create table user_role (
        role_id bigint not null,
        user_id bigint not null
    ) engine=InnoDB;

    create table users (
        is_active bit not null,
        target_score integer not null,
        id bigint not null auto_increment,
        email varchar(255) not null,
        full_name varchar(255) not null,
        password varchar(255) not null,
        primary key (id)
    ) engine=InnoDB;

    alter table mock_tests 
       add constraint UK3264i8tc1kmjcqky878was5se unique (exam_id);

    alter table practice_question_stats 
       add constraint uk_user_question unique (user_id, question_id);

    alter table refresh_tokens 
       add constraint UKghpmfn23vmxfu3spu3lfg4r2d unique (token);

    alter table users 
       add constraint UK6dotkott2kjsp8vw4d0m25fb7 unique (email);

    alter table answer_options 
       add constraint FKfapodm8kfiu9a9a4o2r43rcgp 
       foreign key (question_id) 
       references questions (id);

    alter table exercise_question_groups 
       add constraint FKhee3hkmcf14qf0v68ecu06pri 
       foreign key (exercise_id) 
       references exercises (id);

    alter table exercise_questions 
       add constraint FKeuh5g8sn18oha575eihq5yj0k 
       foreign key (exercise_id) 
       references exercises (id);

    alter table exercise_questions 
       add constraint FK723hcy1nw2mjeedarxds4ktss 
       foreign key (group_id) 
       references exercise_question_groups (id);

    alter table exercises 
       add constraint FKisspl9dr72r1t5ptvop8sagts 
       foreign key (topic_id) 
       references topics (id);

    alter table group_content_blocks 
       add constraint FKl2sa823clgw104kbfxn89wdsm 
       foreign key (group_id) 
       references exercise_question_groups (id);

    alter table group_topic_tags 
       add constraint FKcxlx2qeqw0eskgbwo4odael0c 
       foreign key (group_id) 
       references exercise_question_groups (id);

    alter table group_topic_tags 
       add constraint FKqjrw3cb1nxil1gpduxtysqryr 
       foreign key (topic_id) 
       references topics (id);

    alter table lessons 
       add constraint FKn1lqfilldva7f2y31fxf3p4p1 
       foreign key (topic_id) 
       references topics (id);

    alter table mock_test_answers 
       add constraint FKnb71r32oi5mbovw5nkie7ngkf 
       foreign key (attempt_id) 
       references mock_test_attempts (id);

    alter table mock_test_answers 
       add constraint FKtdlobwkw88h5gpcf5h373whq9 
       foreign key (question_id) 
       references questions (id);

    alter table mock_test_answers 
       add constraint FKq1d4jo2akeki0458pqhbso7yo 
       foreign key (selected_option_id) 
       references answer_options (id);

    alter table mock_test_attempts 
       add constraint FKn228m0ra7nt125ksihc08h57n 
       foreign key (mock_test_id) 
       references mock_tests (id);

    alter table mock_test_attempts 
       add constraint FK1n7im3j31hwr9up4fo0wgdaio 
       foreign key (user_id) 
       references users (id);

    alter table mock_tests 
       add constraint FK9r3cad54c5kat93pqq3l0oh6p 
       foreign key (exam_id) 
       references exams (id);

    alter table parts 
       add constraint FK5wvldjj34cpbt4avm0645q5ye 
       foreign key (exam_id) 
       references exams (id);

    alter table practice_question_stats 
       add constraint FKcs82hq08lr0dw80h6tpmunckl 
       foreign key (question_id) 
       references exercise_questions (id);

    alter table practice_question_stats 
       add constraint FKilapgl15g2l8dvv2d4s6oy7fd 
       foreign key (user_id) 
       references users (id);

    alter table practice_sessions 
       add constraint FK6kv6h8cms8fv9tgy0576tcgva 
       foreign key (section_id) 
       references sections (id);

    alter table practice_sessions 
       add constraint FK4w9c384wvahajiqplaohlbdrq 
       foreign key (topic_id) 
       references topics (id);

    alter table practice_sessions 
       add constraint FK11ce0i5ujtvudi6b0c103slpc 
       foreign key (user_id) 
       references users (id);

    alter table question_groups 
       add constraint FKjdshx1v3fkdvwytohkqfdeuwi 
       foreign key (part_id) 
       references parts (id);

    alter table question_topic_tags 
       add constraint FKjv2wwhwy34gaokpjcdsfv1ec1 
       foreign key (question_id) 
       references exercise_questions (id);

    alter table question_topic_tags 
       add constraint FKmlta4lmn83yl14wodvlgulhpa 
       foreign key (topic_id) 
       references topics (id);

    alter table questions 
       add constraint FKlifriy6n655lp4d9b9att0klv 
       foreign key (question_group_id) 
       references question_groups (id);

    alter table refresh_tokens 
       add constraint FK1lih5y2npsf8u5o3vhdb9y0os 
       foreign key (user_id) 
       references users (id);

    alter table role_permission 
       add constraint FK2xn8qv4vw30i04xdxrpvn3bdi 
       foreign key (permission_id) 
       references permissions (id);

    alter table role_permission 
       add constraint FKtfgq8q9blrp0pt1pvggyli3v9 
       foreign key (role_id) 
       references roles (id);

    alter table topics 
       add constraint FKi1k93bau2c2e3trgq52kh9jd8 
       foreign key (section_id) 
       references sections (id);

    alter table user_exercise_results 
       add constraint FKaimiqickm7wta4m2mmv8ec2a2 
       foreign key (exercise_id) 
       references exercises (id);

    alter table user_exercise_results 
       add constraint FKlmvgfq8njonu9i0xu7cgjyaaj 
       foreign key (user_id) 
       references users (id);

    alter table user_lesson_progress 
       add constraint FKkm3wlef4wdkrsdwkbly0sid0l 
       foreign key (lesson_id) 
       references lessons (id);

    alter table user_lesson_progress 
       add constraint FK15tdn9l75kjm9imsarb223k9q 
       foreign key (user_id) 
       references users (id);

    alter table user_role 
       add constraint FKt7e7djp752sqn6w22i6ocqy6q 
       foreign key (role_id) 
       references roles (id);

    alter table user_role 
       add constraint FKj345gk1bovqvfame88rcx7yyx 
       foreign key (user_id) 
       references users (id);
